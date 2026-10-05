import * as express from 'express';

import NarudzbinaModel from '../models/narudzbina';
import KorisnikModel from '../models/korisnik';

const Stripe = require('stripe');

const stripe = Stripe(
    process.env.STRIPE_SECRET_KEY
);

export class PlacanjeController {

    kreiraj = async (req: express.Request, res: express.Response) => {
        try {
            const klijentId = req.body.klijentId;
            const narudzbineIds = req.body.narudzbineIds;

            if (!klijentId || !Array.isArray(narudzbineIds) || narudzbineIds.length === 0) {
                return res.status(400).json({
                    message: "Nisu poslati podaci za plaćanje."
                });
            }
            const klijent = await KorisnikModel.findById(klijentId);
            if (!klijent) {
                return res.status(404).json({
                    message: "Klijent nije pronađen."
                });
            }

            const narudzbine = await NarudzbinaModel.find({
                _id: {$in: narudzbineIds},
                klijentId: klijentId,
                 status: "naruceno"
            });

            if (narudzbine.length !== narudzbineIds.length) {
                return res.status(400).json({
                    message: "Neke fakture nisu pronađene ili su već plaćene."
                });
            }
            const lineItems = [];
            for (let narudzbina of narudzbine) {
                lineItems.push({
                    price_data: {
                        currency: "rsd", product_data: {name: "Faktura " + narudzbina._id + " - " + narudzbina.nazivStamparije},
                        unit_amount: Math.round(narudzbina.ukupanIznos * 100 )
                    },
                    quantity: 1
                });
            }

            const session = await stripe.checkout.sessions.create({
                mode: "payment",
                line_items: lineItems,
                customer_email: klijent.mejl,
                success_url: "http://localhost:4200/klijent/placanje-uspesno" + "?session_id={CHECKOUT_SESSION_ID}",
                cancel_url: "http://localhost:4200/klijent/placanje-otkazano",
                metadata: {
                    klijentId: klijentId,
                    narudzbineIds: narudzbineIds.join(",")
                }
            });
            return res.json({ url: session.url });

        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Greška prilikom pokretanja plaćanja."
            });
        }
    }


    provjeri = async (req: express.Request, res: express.Response) => {
        try {
            const sessionId = req.body.sessionId;
            if (!sessionId) {
                return res.status(400).json({message: "Nije poslat ID Stripe sesije."});
            }
            const session = await stripe.checkout.sessions.retrieve(sessionId);

            if (session.payment_status !== "paid") {
                return res.status(400).json({message:"Plaćanje nije uspješno završeno."});
            }
            const metadata = session.metadata;
            if (!metadata || !metadata.klijentId || !metadata.narudzbineIds) {
                return res.status(400).json({message:"Nedostaju podaci o fakturama."});
            }
            const klijentId = metadata.klijentId;
            const narudzbineIds = metadata.narudzbineIds.split(",");
            await NarudzbinaModel.updateMany(
                { _id: {$in: narudzbineIds}, klijentId: klijentId, status: "naruceno"},
                { $set: { status: "placeno" } }
            );
            return res.json({
                message: "Plaćanje je uspješno.",
                narudzbineIds: narudzbineIds
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Greška prilikom provjere plaćanja." });
        }
    }
}