import * as express from 'express';
import ProizvodModel from '../models/proizvod'
import KorisnikModel from '../models/korisnik'


export class ProizvodiController {

    brojStamparija = async (req: express.Request, res: express.Response) => {
        try {
            const broj = await KorisnikModel.countDocuments({tip: "stamparija", status: "active"});
            return res.json({broj: broj});
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Greška."
            });
        }
    }
    
    top5 = async (req: express.Request, res: express.Response) => {
        try {
            const proizvodi = await ProizvodModel.find({aktivan: true, kolicinaNaLageru: { $gt: 0 }}).sort({ brojLajkova: -1 }).limit(5);
            return res.json(proizvodi);
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Greška."
            });
        }
    }

    kategorije = async (req: express.Request, res: express.Response) => {
        try {
            const kategorije = await ProizvodModel.distinct("kategorija", {aktivan: true, kolicinaNaLageru: { $gt: 0 }});
            return res.json(kategorije);
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Greška."
            });
        }
    }

    pretraga = async (req: express.Request, res: express.Response) => {
        try {
            const naziv = req.body.naziv;
            const kategorija = req.body.kategorija;
            let uslov: any = {aktivan: true, kolicinaNaLageru: { $gt: 0 } };

            if (naziv) {
                uslov.naziv = { $regex: naziv,  $options: "i" };
            }

            if ( kategorija && kategorija !== "Sve kategorije" ) {
                uslov.kategorija = kategorija;
            }

            const proizvodi = await ProizvodModel.find(uslov);
            return res.json(proizvodi);

        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Greška."
            });
        }
    }

    detalji = async (req: express.Request, res: express.Response) => {
        try {
            const sifra = req.params.sifra;
            const proizvod = await ProizvodModel.findOne({ sifra: sifra });
            if (!proizvod) {
                return res.status(404).json({ message: "Proizvod nije pronađen." });
            }

            const stamparija = await KorisnikModel.findById(proizvod.stamparijaId);

            let adresaStamparije = "";

            if(stamparija && stamparija.adresa_sedista){
                adresaStamparije = stamparija.adresa_sedista;
            }

            return res.json({...proizvod.toObject(), adresaStamparije: adresaStamparije});
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Greška." });
        }
    }

}