import * as express from 'express';
import ProizvodModel from '../models/proizvod'
import proizvod from '../models/proizvod';

export class ProizvodiController {
    dohvatiProizvode = (req: express.Request, res: express.Response) => {
        ProizvodModel.find({}).then(proizvodi => {
            res.json(proizvodi)
        }).catch(err => {
            console.log(err)
            res.json([])
        })
    }

    kupi = (req: express.Request, res: express.Response) => {
        let naziv = req.body.naziv
        let kupovina = req.body.kupovina

        ProizvodModel.updateOne({ naziv: naziv }, { $push: { kupovine: kupovina } }).then(proizvod => {
            res.json({ "message": "OK" })
        }).catch(err => {
            console.log(err)
            res.json({ "message": "Greska pri kupovini" })
        })
    }

    dohvatiProizvod = (req: express.Request, res: express.Response) => {
        let naziv = req.params.naziv

        ProizvodModel.findOne({ naziv: naziv }).then(proizvod => {
            res.json(proizvod)
        }).catch(err => {
            console.log(err)
            res.json(null)
        })
    }

    komentarisi = (req: express.Request, res: express.Response) => {
        let naziv = req.body.naziv
        let komentar = req.body.komentar
    
        ProizvodModel.updateOne({ naziv: naziv }, { $push: { komentari: komentar } }).then(proizvod => {
            res.json({ "message": "OK" })
        }).catch(err => {
            console.log(err)
            res.json({ "message": "Greska pri dodavanju komentara" })
        })
    }

    odobri = (req: express.Request, res: express.Response) => {
        let proizvod = req.body.proizvod
        let komentar = req.body.komentar

        ProizvodModel.updateOne({ id: proizvod.id, 'komentari.kupac': komentar.kupac, 'komentari.tekst': komentar.tekst }, { $set: { 'komentari.$.status': 'odobren' } }).then(proizvod => {
            res.json({ "message": "OK" })
        }).catch(err => {
            console.log(err)
            res.json({ "message": "Greska pri odobravanju komentara" })
        })
    }

    odbaci = (req: express.Request, res: express.Response) => {
        let proizvod = req.body.proizvod
        let komentar = req.body.komentar

        ProizvodModel.updateOne({ id: proizvod.id }, { $pull: { komentari: { kupac: komentar.kupac, tekst: komentar.tekst } } }).then(proizvod => {
            res.json({ "message": "OK" })
        }).catch(err => {
            console.log(err)
            res.json({ "message": "Greska pri odbacivanju komentara" })
        })
    }

    unesi = (req: express.Request, res: express.Response) => {
        ProizvodModel.findOne({}).sort({id: -1}).then(maxIdProizvod => {
            const noviId = Number(maxIdProizvod?.id ?? 0) + 1

            let novProizvod = new ProizvodModel({
                id: noviId,
                naziv: req.body.naziv,
                opis: req.body.opis,
                kupovine: [],
                komentari: []
            })
    
            novProizvod.save().then(proizvod => {
                res.json({ "message": "OK" })
            }).catch(err => {
                console.log(err)
                res.json({ "message": "Greska pri unosu proizvoda" })
            })
        }).catch(err => {
            console.log(err)
            res.json({ "message": "Greska pri unosu proizvoda" })
        })
    }
}