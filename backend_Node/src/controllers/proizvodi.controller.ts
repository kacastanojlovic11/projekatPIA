import * as express from 'express';
import ProizvodModel from '../models/proizvod'
import KorisnikModel from '../models/korisnik'
import KategorijaModel from '../models/kategorija'


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

    dohvatiZaStampariju = async (req: express.Request, res: express.Response) => {
        try {
            const stamparijaId = req.params.stamparijaId;
            const proizvodi = await ProizvodModel.find({stamparijaId: stamparijaId});
            return res.json(proizvodi);
        } catch (err) {
            console.log(err);
            return res.status(500).json({message:"Greška prilikom dohvatanja proizvoda."});
        }
    }

    azurirajKolicinu = async (req: express.Request, res: express.Response) => {
        try {

            const sifra = req.body.sifra;
            const stamparijaId = req.body.stamparijaId;
            const kolicina = Number(req.body.kolicina);

            if (!Number.isInteger(kolicina) || kolicina < 0) {
                return res.status(400).json({message: "Količina mora biti nenegativan cijeli broj."});
            }
            const proizvod = await ProizvodModel.findOne({sifra: sifra, stamparijaId: stamparijaId});
            if (!proizvod) {
                return res.status(404).json({message: "Proizvod nije pronađen."});
            }
            proizvod.kolicinaNaLageru = kolicina;
            await proizvod.save();
            return res.json({message: "Količina je uspješno ažurirana."});
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message:"Greška prilikom ažuriranja količine."
            });
        }
    }

    dodaj = async (req: express.Request, res: express.Response) => {
        try {
            const stamparija = await KorisnikModel.findById(req.body.stamparijaId);
            if (!stamparija || stamparija.tip !== "stamparija") {

                return res.status(400).json({
                    message: "Štamparija nije pronađena."
                });
            }

            const postoji = await ProizvodModel.findOne({sifra: req.body.sifra});

            if (postoji) {
                return res.status(400).json({
                    message: "Proizvod sa tom šifrom već postoji."
                });
            }

            const kategorija = await KategorijaModel.findOne({naziv: req.body.kategorija});
            if (!kategorija || !kategorija.potkategorije.includes(req.body.potkategorija)) {
                return res.status(400).json({
                    message: "Kategorija ili potkategorija nije ispravna."
                });
            }

            const files = req.files as {[fieldname: string]: Express.Multer.File[]};
            let slikaUrl = "";

            if (files && files["glavnaSlika"] && files["glavnaSlika"].length > 0) {
                slikaUrl = "http://localhost:4000/uploads/proizvodi/" + files["glavnaSlika"][0].filename;
            }

            const dodatneSlike: string[] = [];
            if ( files && files["dodatneSlike"] ) {
                for ( let slika of files["dodatneSlike"] ) {
                    dodatneSlike.push("http://localhost:4000/uploads/proizvodi/" + slika.filename);
                }
            }

            const dostupneBoje = JSON.parse(req.body.dostupneBoje);
            const uslugeStampe = JSON.parse(req.body.uslugeStampe);
            const proizvod = new ProizvodModel({
                sifra: req.body.sifra,
                stamparijaId: stamparija._id.toString(),
                nazivStamparije: stamparija.naziv_institucije,
                grad: stamparija.grad,
                naziv: req.body.naziv,
                opis: req.body.opis,
                kategorija: req.body.kategorija,
                potkategorija: req.body.potkategorija,
                jedinicnaCena: Number(req.body.jedinicnaCena),
                kolicinaNaLageru: Number(req.body.kolicinaNaLageru),
                dostupneBoje: dostupneBoje,
                slikaUrl: slikaUrl,
                dodatneSlike: dodatneSlike,
                uslugeStampe: uslugeStampe,
                aktivan: true
            });
            await proizvod.save();
            return res.json({message: "Proizvod je uspješno dodat."});
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Greška prilikom dodavanja proizvoda."
            });
        }
    }


    dodajIzJson = async (req: express.Request, res: express.Response) => {
        try {
            const stamparijaId = req.body.stamparijaId;
            if (!req.file) {
                return res.status(400).json({
                    message: "JSON fajl nije dodat."
                });
            }

            const stamparija = await KorisnikModel.findById(stamparijaId);
            if (!stamparija || stamparija.tip !== "stamparija") {
                return res.status(400).json({
                    message: "Štamparija nije pronađena."
                });
            }
            let podaci: any;
            try {
                const tekst = req.file.buffer.toString("utf8");
                podaci = JSON.parse(tekst);
            } catch (err) {
                return res.status(400).json({
                    message: "Fajl nije ispravan JSON."
                });
            }

            if (!podaci.proizvodi || !Array.isArray(podaci.proizvodi) ||podaci.proizvodi.length === 0) {
                return res.status(400).json({
                    message: "JSON ne sadrži proizvode."
                });
            }
            const kategorije = await KategorijaModel.find();
            const sifreUFajlu: string[] = [];
            for (let proizvod of podaci.proizvodi) {
                if (!proizvod.sifra || !proizvod.naziv || !proizvod.kategorija || !proizvod.potkategorija) {
                    return res.status(400).json({
                        message: "Neki proizvod nema obavezne podatke."
                    });
                }
                if (sifreUFajlu.includes(proizvod.sifra)) {
                    return res.status(400).json({
                        message: "Šifra " + proizvod.sifra + " se ponavlja u JSON fajlu."
                    });
                }
                sifreUFajlu.push(proizvod.sifra);
                let kategorijaIspravna = false;
                for (let kategorija of kategorije) {
                    if (kategorija.naziv === proizvod.kategorija && kategorija.potkategorije.includes(proizvod.potkategorija)) {
                        kategorijaIspravna = true;
                        break;
                    }
                }
                if (!kategorijaIspravna) {
                    return res.status(400).json({
                        message: "Neispravna kategorija za proizvod " + proizvod.sifra + "."
                    });
                }
                if (!Number.isInteger(proizvod.kolicinaNaLageru) || proizvod.kolicinaNaLageru < 0) {
                    return res.status(400).json({
                        message: "Neispravna količina za proizvod " + proizvod.sifra + "."
                    });
                }
                if (proizvod.jedinicnaCena < 0) {
                    return res.status(400).json({
                        message: "Neispravna cijena za proizvod " + proizvod.sifra + "."
                    });
                }
            }
            const postojeci = await ProizvodModel.find({sifra: {$in: sifreUFajlu}});
            if (postojeci.length > 0) {
                return res.status(400).json({
                    message: "Proizvod sa šifrom " + postojeci[0].sifra + " već postoji."
                });
            }

            const proizvodiZaDodavanje: any[] = [];
            for (let proizvod of podaci.proizvodi) {
                proizvodiZaDodavanje.push({ 
                    sifra: proizvod.sifra,
                    stamparijaId: stamparija._id.toString(),
                    nazivStamparije: stamparija.naziv_institucije,
                    grad: stamparija.grad,
                    naziv: proizvod.naziv,
                    opis: proizvod.opis || "",
                    kategorija: proizvod.kategorija,
                    potkategorija: proizvod.potkategorija,
                    jedinicnaCena: proizvod.jedinicnaCena,
                    kolicinaNaLageru: proizvod.kolicinaNaLageru,
                    dostupneBoje: proizvod.dostupneBoje && proizvod.dostupneBoje.length > 0 ? proizvod.dostupneBoje : ["Bela"],
                    slikaUrl: "",
                    dodatneSlike: [],
                    uslugeStampe: proizvod.uslugeStampe || [],
                    aktivan: true,
                    likes: 0,
                    dislikes: 0
                });
            }
            await ProizvodModel.insertMany(proizvodiZaDodavanje);
            return res.json({
                message: "Proizvodi su uspješno dodati iz JSON fajla.",
                sifre: sifreUFajlu
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Greška prilikom učitavanja JSON fajla."
            });
        }
    }

    dodajSlike = async (req: express.Request, res: express.Response) => {
        try {
            const sifra = req.params.sifra;
            const stamparijaId = req.body.stamparijaId;
            const proizvod = await ProizvodModel.findOne({
                sifra: sifra,
                stamparijaId: stamparijaId
            });

            if (!proizvod) {
                return res.status(404).json({
                    message: "Proizvod nije pronađen."
                });
            }

            const files = req.files as {[fieldname: string]: Express.Multer.File[]};
            if (files && files["glavnaSlika"] && files["glavnaSlika"].length > 0) {
                proizvod.slikaUrl = "http://localhost:4000/uploads/proizvodi/" + files["glavnaSlika"][0].filename;
            }
            if (files && files["dodatneSlike"]) {
                const slike: string[] = [];
                for (let slika of files["dodatneSlike"]) {
                    slike.push("http://localhost:4000/uploads/proizvodi/" + slika.filename);
                }
                proizvod.dodatneSlike = slike;
            }
            await proizvod.save();
            return res.json({
                message: "Slike su uspješno dodate."
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Greška prilikom dodavanja slika."
            });
        }
    }
}