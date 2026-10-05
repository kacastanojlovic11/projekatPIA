import * as express from 'express';

import UtisakModel from '../models/utisak';
import ProizvodModel from '../models/proizvod';
import NarudzbinaModel from '../models/narudzbina';
import KorisnikModel from '../models/korisnik';

export class UtisciController {

    sacuvaj = async (req: express.Request, res: express.Response) => {
        try {

            const klijentId = req.body.klijentId;
            const sifra = req.body.sifra;
            const reakcija = req.body.reakcija;
            const komentar = req.body.komentar;

            if (reakcija !== "like" && reakcija !== "dislike") {
                return res.status(400).json({
                    message: "Reakcija nije ispravna."
                });
            }

            const klijent = await KorisnikModel.findById(klijentId);

            if (!klijent) {
                return res.status(404).json({
                    message: "Klijent nije pronađen."
                });
            }
            const narudzbina = await NarudzbinaModel.findOne({ klijentId: klijentId, status: "primljeno", "stavke.sifra": sifra });

            if (!narudzbina) {
                return res.status(400).json({
                    message: "Možete ocijeniti samo primljen proizvod."
                });
            }

            const stariUtisak = await UtisakModel.findOne({ klijentId: klijentId, sifraProizvoda: sifra });

            if (stariUtisak) {

                if (stariUtisak.reakcija !== reakcija) {

                    if (stariUtisak.reakcija === "like") {
                        await ProizvodModel.updateOne(
                            { sifra: sifra },
                            { $inc: { brojLajkova: -1, brojDislajkova: 1 } }
                        );
                    } else {
                        await ProizvodModel.updateOne(
                            { sifra: sifra },
                            { $inc: { brojLajkova: 1, brojDislajkova: -1 } }
                        );
                    }

                    stariUtisak.reakcija = reakcija;
                    stariUtisak.datum = new Date();
                }

                stariUtisak.komentar = komentar;
                await stariUtisak.save();
            } else {
                const noviUtisak = new UtisakModel({
                    klijentId: klijentId,
                    kor_ime: klijent.kor_ime,
                    sifraProizvoda: sifra,
                    reakcija: reakcija,
                    komentar: komentar
                });

                await noviUtisak.save();

                if (reakcija === "like") {
                    await ProizvodModel.updateOne(
                        { sifra: sifra },
                        { $inc: { brojLajkova: 1 } }
                    );
                } else {
                    await ProizvodModel.updateOne(
                        { sifra: sifra },
                        { $inc: { brojDislajkova: 1 } }
                    );
                }
            }
            return res.json({ message: "Utisak je uspješno sačuvan." });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Greška prilikom čuvanja utiska." });
        }
    }

    poslednjih5 = async (req: express.Request, res: express.Response) => {
        try {
            const sifra = req.params.sifra;
            const utisci = await UtisakModel.find({ sifraProizvoda: sifra, komentar: { $ne: "" } }).sort({ datum: -1 }).limit(5);
            return res.json(utisci);

        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Greška prilikom dohvatanja komentara."
            });
        }
    }

    dohvatiZaKlijenta = async (req: express.Request, res: express.Response) => {
        try {
            const klijentId = req.params.klijentId;

            const utisci = await UtisakModel.find({klijentId: klijentId});

            return res.json(utisci);

        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Greška prilikom dohvatanja utisaka."
            });
        }
    }
}