import * as express from 'express';
import NarudzbinaModel from '../models/narudzbina';
import UtisakModel from '../models/utisak';
import ProizvodModel from '../models/proizvod';

export class StatistikaController {

    prometStamparija = async (req: express.Request, res: express.Response) => {
        try {
            const prijeTriMjeseca = new Date();
            prijeTriMjeseca.setMonth(prijeTriMjeseca.getMonth() - 3);

            const rezultat = await NarudzbinaModel.aggregate([
                {
                    $match: {
                        datumNarucivanja: { $gte: prijeTriMjeseca },
                        status: {
                            $in: [
                                "placeno",
                                "u_stampi",
                                "isporuceno",
                                "primljeno"
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: "$stamparijaId",
                        nazivStamparije: { $first: "$nazivStamparije" },
                        promet: { $sum: "$ukupanIznos" }
                    }
                },
                { $sort: { promet: -1 } }
            ]);
            return res.json(rezultat);
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Greška prilikom računanja statistike."
            });
        }
    }


    najcesceNarucivaniProizvodi = async (req: express.Request, res: express.Response) => {
        try {

            const prijeMjesecDana = new Date();

            prijeMjesecDana.setMonth(prijeMjesecDana.getMonth() - 1);

            const rezultat = await NarudzbinaModel.aggregate([
                {
                    $match: {
                        datumNarucivanja: {
                            $gte: prijeMjesecDana
                        }
                    }
                },
                {
                    $unwind: "$stavke"
                },
                {
                    $group: {
                        _id: "$stavke.sifra",

                        naziv: {
                            $first: "$stavke.nazivProizvoda"
                        },

                        kolicina: {
                            $sum: "$stavke.kolicina"
                        }
                    }
                },
                {
                    $sort: {
                        kolicina: -1
                    }
                }
            ]);

            return res.json(rezultat);

        } catch (err) {

            console.log(err);

            return res.status(500).json({
                message: "Greška prilikom računanja statistike proizvoda."
            });
        }
    }

    ocjeneProizvoda = async (req: express.Request, res: express.Response) => {
        try {
            const utisci = await UtisakModel.find().sort({ datum: 1 });

            const sifre = Array.from(new Set(utisci.map(u => u.sifraProizvoda)));

            const proizvodi = await ProizvodModel.find({sifra: {$in: sifre}});
            const rezultat: any[] = [];

            for (const proizvod of proizvodi) {
                const utisciProizvoda = utisci.filter(u => u.sifraProizvoda === proizvod.sifra);

                let lajkovi = 0;
                let dislajkovi = 0;

                const tacke: any[] = [];

                for (const utisak of utisciProizvoda) {
                    if (utisak.reakcija === "like") {
                        lajkovi++;
                    } else {
                        dislajkovi++;
                    }

                    const ukupno = lajkovi + dislajkovi;
                    const ocjena = ukupno > 0 ? (lajkovi / ukupno * 100) : 0;

                    tacke.push({datum: utisak.datum, ocjena: Number(ocjena.toFixed(2))});
                }

                rezultat.push({
                    sifra: proizvod.sifra,
                    naziv: proizvod.naziv,
                    tacke: tacke
                });
            }
            return res.json(rezultat);

        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Greška prilikom računanja ocjena proizvoda."
            });
        }
    }
}