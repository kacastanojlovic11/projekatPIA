import * as express from 'express';
import ProizvodModel from '../models/proizvod';
import KorisnikModel from '../models/korisnik';
import NarudzbinaModel from '../models/narudzbina';
import { posaljiFakture } from '../services/fakture.service';

export class NarudzbineController {

    potvrdi = async (req: express.Request, res: express.Response) => {

        const rezervisano: { sifra: string, kolicina: number }[] = [];
        const napravljeneNarudzbine: any[] = [];
        try {
            const klijentId = req.body.klijentId;
            const stavke = req.body.stavke;

            if (!klijentId || !Array.isArray(stavke) || stavke.length === 0) {
                return res.status(400).json({
                    message: "Korpa je prazna ili podaci nisu ispravni."
                });
            }

            const klijent = await KorisnikModel.findById(klijentId);

            if (!klijent || klijent.tip !== "klijent_fizicko" ||
                klijent.status !== "active") {

                return res.status(400).json({
                    message: "Klijent nije pronađen ili nije aktivan."
                });
            }

            const provereneStavke: any[] = [];
            const kolicine: { [sifra: string]: number } = {};

            for (let stavka of stavke) {

                const proizvod = await ProizvodModel.findOne({
                    sifra: stavka.sifra, aktivan: true
                });

                if (!proizvod) {
                    return res.status(400).json({
                        message: "Jedan od proizvoda nije dostupan."
                    });
                }

                if (!Number.isInteger(stavka.kolicina) || stavka.kolicina < 1) {
                    return res.status(400).json({
                        message: "Količina mora biti pozitivan cijeli broj."
                    });
                }

                const usluga = proizvod.uslugeStampe.find(u => String(u.idUsluge) === String(stavka.uslugaId));

                if (!usluga) {
                    return res.status(400).json({
                        message: "Izabrana vrsta štampe nije dostupna."
                    });
                }

                const boje = proizvod.dostupneBoje.length > 0 ? proizvod.dostupneBoje : ["Bela"];

                if (!boje.includes(stavka.boja)) {
                    return res.status(400).json({
                        message: "Izabrana boja nije dostupna."
                    });
                }

                const dodatnaCena = usluga.dodatnaCenaPoKomadu || 0;

                provereneStavke.push({
                    sifra: proizvod.sifra,
                    nazivProizvoda: proizvod.naziv,
                    stamparijaId: proizvod.stamparijaId,
                    nazivStamparije: proizvod.nazivStamparije,
                    grad: proizvod.grad,
                    boja: stavka.boja,
                    uslugaId: String(usluga.idUsluge),
                    tipStampe: usluga.tipStampe,
                    jedinicnaCena: proizvod.jedinicnaCena,
                    dodatnaCenaPoKomadu: dodatnaCena,
                    kolicina: stavka.kolicina,
                    ukupnaCena: (proizvod.jedinicnaCena + dodatnaCena) * stavka.kolicina,
                    tekst: stavka.tekst,
                    slikaZaStampu: stavka.slikaZaStampu
                });

                if (!kolicine[proizvod.sifra]) {
                    kolicine[proizvod.sifra] = 0;
                }

                kolicine[proizvod.sifra] += stavka.kolicina;
            }

            for (let sifra in kolicine) {

                const kolicina = kolicine[sifra];

                const rezultat = await ProizvodModel.updateOne(
                    {
                        sifra: sifra,
                        aktivan: true,
                        kolicinaNaLageru: { $gte: kolicina }
                    },
                    {
                        $inc: {
                            kolicinaNaLageru: -kolicina
                        }
                    }
                );

                if (rezultat.modifiedCount !== 1) {
                    throw new Error("NEMA_LAGERA");
                }

                rezervisano.push({
                    sifra: sifra,
                    kolicina: kolicina
                });
            }

            const stamparije: string[] = [];

            for (let stavka of provereneStavke) {
                if (!stamparije.includes(stavka.stamparijaId)) {
                    stamparije.push(stavka.stamparijaId);
                }
            }

            for (let stamparijaId of stamparije) {

                const stavkeStamparije = provereneStavke.filter(
                    s => s.stamparijaId === stamparijaId
                );

                let ukupanIznos = 0;

                for (let stavka of stavkeStamparije) {
                    ukupanIznos += stavka.ukupnaCena;
                }

                const narudzbina = new NarudzbinaModel({
                    klijentId: klijentId,
                    stamparijaId: stamparijaId,
                    nazivStamparije: stavkeStamparije[0].nazivStamparije,
                    grad: stavkeStamparije[0].grad,
                    stavke: stavkeStamparije,
                    ukupanIznos: ukupanIznos,
                    status: "naruceno"
                });

                await narudzbina.save();

                napravljeneNarudzbine.push(narudzbina);
            }

            await posaljiFakture(
                klijent.mejl,
                napravljeneNarudzbine
            );

            return res.json({
                message: "Narudžbina je uspješno potvrđena. Fakture su poslate na email.",
                narudzbine: napravljeneNarudzbine
            });

        } catch (err: any) {

            console.log(err);

            for (let narudzbina of napravljeneNarudzbine) {
                try {
                    await NarudzbinaModel.deleteOne({ _id: narudzbina._id });
                } catch (greska) {
                    console.log("Greška pri brisanju fakture:", greska);
                }
            }

            for (let stavka of rezervisano) {
                try {
                    await ProizvodModel.updateOne(
                        { sifra: stavka.sifra },
                        { $inc: { kolicinaNaLageru: stavka.kolicina } }
                    );
                } catch (greska) {
                    console.log("Greška pri vraćanju lagera:", greska);
                }
            }

            if (err.message === "NEMA_LAGERA") {
                return res.status(400).json({
                    message: "Нема довољно производа тренутно на стању"
                });
            }

            return res.status(500).json({
                message: "Greška prilikom potvrde narudžbine."
            });
        }
    }

    dohvatiZaKlijenta = async (req: express.Request, res: express.Response) => {
        try {
            const klijentId = req.params.klijentId;
            const narudzbine = await NarudzbinaModel.find({ klijentId: klijentId });
            return res.json(narudzbine);
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Greška prilikom dohvatanja narudžbina." });
        }
    }

    otkazi = async (req: express.Request, res: express.Response) => {
        try {
            const id = req.body.id;
            const narudzbina = await NarudzbinaModel.findById(id);
            if (!narudzbina) {
                return res.status(404).json({
                    message: "Narudžbina nije pronađena."
                });
            }

            if (narudzbina.status !== "naruceno") {
                return res.status(400).json({
                    message: "Ova narudžbina se više ne može otkazati."
                });
            }

            for (let stavka of narudzbina.stavke) {

                await ProizvodModel.updateOne(
                    { sifra: stavka.sifra },
                    { $inc: { kolicinaNaLageru: stavka.kolicina } }
                );
            }
            await NarudzbinaModel.deleteOne({ _id: id });
            return res.json({
                message: "Narudžbina je uspješno otkazana."
            });

        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Greška prilikom otkazivanja narudžbine."
            });
        }
    }

    arhiva = async (req: express.Request, res: express.Response) => {
        try {
            const klijentId = req.params.klijentId;
            const narudzbine = await NarudzbinaModel.find({
                klijentId: klijentId,
                status: { $in: ["isporuceno", "primljeno"] }
            });

            const arhiva: any[] = [];

            for (let narudzbina of narudzbine) {
                for (let stavka of narudzbina.stavke) {
                    arhiva.push({
                        fakturaId: narudzbina._id,
                        datumNarucivanja: narudzbina.datumNarucivanja,
                        status: narudzbina.status,
                        stamparijaId: narudzbina.stamparijaId,
                        nazivStamparije: narudzbina.nazivStamparije,
                        sifra: stavka.sifra,
                        nazivProizvoda: stavka.nazivProizvoda,
                        kolicina: stavka.kolicina
                    });
                }
            }
            return res.json(arhiva);
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Greška prilikom dohvatanja arhive."
            });
        }
    }

    oznaciPrimljeno = async (req: express.Request, res: express.Response) => {
        try {
            const fakturaId = req.body.fakturaId;
            const klijentId = req.body.klijentId;
            const narudzbina = await NarudzbinaModel.findOne({ _id: fakturaId, klijentId: klijentId });
            if (!narudzbina) {
                return res.status(404).json({
                    message: "Narudžbina nije pronađena."
                });
            }

            if (narudzbina.status !== "isporuceno") {
                return res.status(400).json({
                    message: "Samo isporučena narudžbina može biti označena kao primljena."
                });
            }

            narudzbina.status = "primljeno";
            await narudzbina.save();
            return res.json({
                message: "Proizvodi su označeni kao primljeni."
            });

        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Greška."
            });
        }
    }

    dohvatiZaStampariju = async (req: express.Request, res: express.Response) => {
        try {
            const stamparijaId = req.params.stamparijaId;
            const narudzbine = await NarudzbinaModel.find({ stamparijaId: stamparijaId }).sort({ datumNarucivanja: -1 });
            return res.json(narudzbine);
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Greška prilikom dohvatanja narudžbina."
            });
        }
    }


    promijeniStatus = async (req: express.Request, res: express.Response) => {
        try {
            const narudzbinaId = req.body.narudzbinaId;
            const stamparijaId = req.body.stamparijaId;
            const noviStatus = req.body.noviStatus;
            const narudzbina = await NarudzbinaModel.findOne({ _id: narudzbinaId, stamparijaId: stamparijaId });
            if (!narudzbina) {
                return res.status(404).json({
                    message: "Narudžbina nije pronađena."
                });
            }
            let dozvoljeno = false;
            if (narudzbina.status === "placeno" && noviStatus === "u_stampi") dozvoljeno = true;
            if (narudzbina.status === "u_stampi" && noviStatus === "isporuceno") dozvoljeno = true;
            if (!dozvoljeno) {
                return res.status(400).json({
                    message: "Promjena statusa nije dozvoljena."
                });
            }
            narudzbina.status = noviStatus;
            await narudzbina.save();
            return res.json({
                message: "Status je uspješno promijenjen.",
                narudzbina: narudzbina
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Greška prilikom promjene statusa."
            });
        }
    }
}