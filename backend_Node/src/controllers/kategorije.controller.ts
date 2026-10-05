import * as express from 'express';

import KategorijaModel from '../models/kategorija';

export class KategorijeController {

    dohvatiSve = async (req: express.Request, res: express.Response) => {
        try {
            const kategorije = await KategorijaModel.find();
            return res.json(kategorije);
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Greška prilikom dohvatanja kategorija."
            });
        }
    }

    dodajKategoriju = async (req: express.Request, res: express.Response) => {
        try {
            const naziv = req.body.naziv;
            if (!naziv || naziv.trim() === "") {
                return res.status(400).json({
                    message: "Naziv kategorije je obavezan."
                });
            }

            const postoji = await KategorijaModel.findOne({
                naziv: naziv.trim()
            });

            if (postoji) {
                return res.status(400).json({
                    message: "Kategorija već postoji."
                });
            }

            const kategorija = new KategorijaModel({
                naziv: naziv.trim(),
                potkategorije: []
            });

            await kategorija.save();

            return res.json({
                message: "Kategorija je uspješno dodata.",
                kategorija: kategorija
            });

        } catch (err) {

            console.log(err);

            return res.status(500).json({
                message: "Greška prilikom dodavanja kategorije."
            });
        }
    }

    dodajPotkategoriju = async (req: express.Request, res: express.Response) => {
        try {

            const id = req.params.id;
            const naziv = req.body.naziv;

            if (!naziv || naziv.trim() === "") {
                return res.status(400).json({
                    message: "Naziv potkategorije je obavezan."
                });
            }

            const kategorija = await KategorijaModel.findById(id);

            if (!kategorija) {
                return res.status(404).json({
                    message: "Kategorija nije pronađena."
                });
            }

            const vecPostoji = kategorija.potkategorije.some(p => p.toLowerCase() === naziv.trim().toLowerCase());

            if (vecPostoji) {
                return res.status(400).json({
                    message: "Potkategorija već postoji."
                });
            }

            kategorija.potkategorije.push(naziv.trim());

            await kategorija.save();

            return res.json({
                message: "Potkategorija je uspješno dodata.",
                kategorija: kategorija
            });

        } catch (err) {

            console.log(err);

            return res.status(500).json({
                message: "Greška prilikom dodavanja potkategorije."
            });
        }
    }
}
