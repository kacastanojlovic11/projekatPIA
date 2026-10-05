import * as express from 'express';
import JavnaNabavkaModel from '../models/javna-nabavka';
import KorisnikModel from '../models/korisnik';
import ProizvodModel from '../models/proizvod';
import NarudzbinaModel from '../models/narudzbina';
import { posaljiObavjestenjeStamparijama } from '../services/javne-nabavke-mail.service';
import { napraviIzvjestajJavneNabavke } from '../services/javne-nabavke-pdf.service';
import { posaljiFakture } from '../services/fakture.service';


export class JavneNabavkeController {

    kreiraj = async (req: express.Request, res: express.Response) => {
        try {
            const klijentId = req.body.klijentId;
            const stavke = req.body.stavke;
            if (!klijentId || !Array.isArray(stavke) || stavke.length === 0) {
                return res.status(400).json({
                    message: "Korpa je prazna."
                });
            }
            const klijent = await KorisnikModel.findById(klijentId);
            if (!klijent || klijent.tip !== "klijent_pravno" || klijent.status !== "active") {
                return res.status(400).json({
                    message: "Pravno lice nije pronađeno."
                });
            }
            const stavkeNabavke: any[] = [];
            for (let stavka of stavke) {
                const proizvod = await ProizvodModel.findOne({ sifra: stavka.sifra, aktivan: true });
                if (!proizvod) {
                    return res.status(400).json({
                        message: "Proizvod " + stavka.sifra + " više nije dostupan."
                    });
                }
                const kolicina = Number(stavka.kolicina);
                if (!Number.isInteger(kolicina) || kolicina <= 0) {
                    return res.status(400).json({
                        message: "Neispravna količina."
                    });
                }

                stavkeNabavke.push({
                    sifra: proizvod.sifra,
                    nazivProizvoda: proizvod.naziv,
                    kategorija: proizvod.kategorija,
                    potkategorija: proizvod.potkategorija,
                    kolicina: kolicina,
                    boja: stavka.boja || "",
                    tipStampe: stavka.tipStampe || "",
                    tekst: stavka.tekst || "",
                    slikaZaStampu: stavka.slikaZaStampu || ""
                });
            }
            const sada = new Date();
            const datumIsteka = new Date(sada.getTime() + 10 * 60 * 1000);
            const javnaNabavka = new JavnaNabavkaModel({
                klijentId: klijent._id.toString(),
                nazivInstitucije: klijent.naziv_institucije,
                datumRaspisivanja: sada,
                datumIsteka: datumIsteka,
                stavke: stavkeNabavke,
                ponude: [],
                status: "otvorena"
            });
            await javnaNabavka.save();
            const stamparije = await KorisnikModel.find({
                tip: "stamparija",
                status: "active"
            });
            let emailUspjesan = true;
            try {
                await posaljiObavjestenjeStamparijama(stamparije, javnaNabavka);
            } catch (err) {
                console.log("Greška pri slanju email obavještenja:", err);
                emailUspjesan = false;
            }
            return res.json({
                message: emailUspjesan ? "Javna nabavka je uspješno raspisana." : "Javna nabavka je raspisana, ali neka email obavještenja nisu poslata.",
                javnaNabavka: javnaNabavka
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Greška prilikom kreiranja javne nabavke."
            });
        }
    }

    dohvatiZaKlijenta = async (req: express.Request, res: express.Response) => {
        try {
            const klijentId = req.params.klijentId;
            const sada = new Date();
            const istekle = await JavnaNabavkaModel.find({
                klijentId: klijentId,
                status: "otvorena",
                datumIsteka: { $lte: sada }
            })

            for (let nabavka of istekle) {
                await this.zakljuciJednu(nabavka);
            }

            const nabavke = await JavnaNabavkaModel.find({ klijentId: klijentId }).sort({ datumRaspisivanja: -1 });
            return res.json(nabavke);
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Greška prilikom dohvatanja javnih nabavki."
            });
        }
    }


    dohvatiOtvorene = async (req: express.Request, res: express.Response) => {

        try {
            const stamparijaId = req.params.stamparijaId;
            const sada = new Date();
            const nabavke = await JavnaNabavkaModel.find({ status: "otvorena", datumIsteka: { $gt: sada } }).sort({ datumRaspisivanja: -1 });
            const rezultat: any[] = [];
            for (let nabavka of nabavke) {
                const objekat = nabavka.toObject();
                const vecPonudio = nabavka.ponude.some(ponuda => ponuda.stamparijaId === stamparijaId);
                rezultat.push({ ...objekat, vecPonudio: vecPonudio });
            }
            return res.json(rezultat);
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Greška prilikom dohvatanja licitacija."
            });
        }
    }

    posaljiPonudu = async (req: express.Request, res: express.Response) => {
        try {
            const nabavkaId = req.body.nabavkaId;
            const stamparijaId = req.body.stamparijaId;
            const stavkePonude = req.body.stavke;
            if (!Array.isArray(stavkePonude)) {
                return res.status(400).json({
                    message: "Ponuda nije ispravna."
                });
            }
            const stamparija = await KorisnikModel.findById(stamparijaId);
            if (!stamparija || stamparija.tip !== "stamparija" || stamparija.status !== "active") {
                return res.status(400).json({
                    message: "Štamparija nije pronađena."
                });
            }
            const nabavka = await JavnaNabavkaModel.findById(nabavkaId);
            if (!nabavka) {
                return res.status(404).json({
                    message: "Javna nabavka nije pronađena."
                });
            }
            if (nabavka.status !== "otvorena" || new Date() >= new Date(nabavka.datumIsteka)) {
                return res.status(400).json({
                    message: "Licitacija je završena."
                });
            }
            const postojecaPonuda = nabavka.ponude.find(ponuda => ponuda.stamparijaId === stamparijaId);
            if (postojecaPonuda) {
                return res.status(400).json({
                    message: "Već ste poslali ponudu za ovu javnu nabavku."
                });
            }

            if (stavkePonude.length !== nabavka.stavke.length) {
                return res.status(400).json({
                    message: "Ponuda mora sadržati sve tražene proizvode."
                });
            }
            const provjereneStavke: any[] = [];
            let ukupanIznos = 0;

            for (let i = 0; i < nabavka.stavke.length; i++) {
                const trazenaStavka = nabavka.stavke[i];
                const ponuda = stavkePonude[i];
                if (!ponuda || ponuda.trazenaSifra !== trazenaStavka.sifra) {
                    return res.status(400).json({
                        message: "Nedostaje proizvod u ponudi."
                    });
                }
                const cijena = Number(ponuda.jedinicnaCena);
                if (isNaN(cijena) || cijena <= 0) {
                    return res.status(400).json({
                        message: "Cijena u ponudi nije ispravna."
                    });
                }

                const proizvod = await ProizvodModel.findOne({
                    sifra: ponuda.ponudjeniProizvodSifra,
                    stamparijaId: stamparijaId,
                    aktivan: true
                })
                if (!proizvod) {
                    return res.status(400).json({
                        message: "Ponuđeni proizvod nije pronađen."
                    });
                }

                if (proizvod.kategorija !== trazenaStavka.kategorija || proizvod.potkategorija !== trazenaStavka.potkategorija) {
                    return res.status(400).json({
                        message: "Ponuđeni proizvod ne odgovara traženoj kategoriji."
                    });
                }
                if (proizvod.kolicinaNaLageru < (trazenaStavka.kolicina || 0)) {
                    return res.status(400).json({
                        message: "Nema dovoljno proizvoda " + proizvod.naziv + " na lageru."
                    });
                }
                const ukupnaCena = cijena * (trazenaStavka.kolicina || 0);
                ukupanIznos += ukupnaCena;
                provjereneStavke.push({
                    trazenaSifra: trazenaStavka.sifra,
                    ponudjeniProizvodSifra: proizvod.sifra,
                    nazivProizvoda: proizvod.naziv,
                    kolicina: trazenaStavka.kolicina,
                    jedinicnaCena: cijena,
                    ukupnaCena: ukupnaCena
                });
            }

            nabavka.ponude.push({
                stamparijaId: stamparijaId,
                nazivStamparije: stamparija.naziv_institucije || "",
                stavke: provjereneStavke,
                ukupanIznos: ukupanIznos,
                datumPonude: new Date()
            });
            await nabavka.save();
            return res.json({
                message: "Ponuda je uspješno poslata.",
                ukupanIznos: ukupanIznos
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Greška prilikom slanja ponude."
            });
        }
    }

    zakljuciJednu = async (nabavka: any) => {
        if (nabavka.status !== "otvorena") return;

        const ponude = [...nabavka.ponude].sort((a: any, b: any) => a.ukupanIznos - b.ukupanIznos);
        let pobjednickaPonuda: any = null;
        for (let ponuda of ponude) {
            let imaDovoljno = true;
            const potrebneKolicine: { [sifra: string]: number } = {};
            for (let stavka of ponuda.stavke) {
                if (!potrebneKolicine[stavka.ponudjeniProizvodSifra]) {
                    potrebneKolicine[stavka.ponudjeniProizvodSifra] = 0;
                }
                potrebneKolicine[stavka.ponudjeniProizvodSifra] += stavka.kolicina;
            }

            for (let sifra in potrebneKolicine) {
                const proizvod = await ProizvodModel.findOne({ sifra: sifra, stamparijaId: ponuda.stamparijaId, aktivan: true });
                if (!proizvod || proizvod.kolicinaNaLageru < potrebneKolicine[sifra]) {
                    imaDovoljno = false;
                    break;
                }
            }

            if (imaDovoljno) {
                pobjednickaPonuda = ponuda;
                break;
            }
        }

        if (!pobjednickaPonuda) {
            nabavka.status = "zavrsena";
            await nabavka.save();
            return;
        }
        
        const potrebneKolicine: { [sifra: string]: number } = {};
        for (let stavka of pobjednickaPonuda.stavke) {
            if (!potrebneKolicine[stavka.ponudjeniProizvodSifra]) {
                potrebneKolicine[stavka.ponudjeniProizvodSifra] = 0;
            }
            potrebneKolicine[stavka.ponudjeniProizvodSifra] += stavka.kolicina;
        }
        for (let sifra in potrebneKolicine) {
            await ProizvodModel.updateOne(
                {
                    sifra: sifra,
                    stamparijaId: pobjednickaPonuda.stamparijaId
                },
                { $inc: { kolicinaNaLageru: -potrebneKolicine[sifra] } }
            );
        }
        const stavkeNarudzbine: any[] = [];
        for (let i = 0; i < pobjednickaPonuda.stavke.length; i++) {
            const stavka = pobjednickaPonuda.stavke[i];
            const trazenaStavka = nabavka.stavke[i];
            stavkeNarudzbine.push({
                sifra: stavka.ponudjeniProizvodSifra,
                nazivProizvoda: stavka.nazivProizvoda,
                boja: trazenaStavka ? trazenaStavka.boja : "",
                uslugaId: "",
                tipStampe: trazenaStavka ? trazenaStavka.tipStampe : "",
                jedinicnaCena: stavka.jedinicnaCena,
                dodatnaCenaPoKomadu: 0,
                kolicina: stavka.kolicina,
                ukupnaCena: stavka.ukupnaCena,
                tekst: trazenaStavka ? trazenaStavka.tekst : "",
                slikaZaStampu: trazenaStavka ? trazenaStavka.slikaZaStampu : ""
            });
        }

        const prviProizvod = await ProizvodModel.findOne({
            sifra: pobjednickaPonuda.stavke[0].ponudjeniProizvodSifra,
            stamparijaId: pobjednickaPonuda.stamparijaId
        });

        const narudzbina = new NarudzbinaModel({
            klijentId: nabavka.klijentId,
            stamparijaId: pobjednickaPonuda.stamparijaId,
            nazivStamparije: pobjednickaPonuda.nazivStamparije,
            grad: prviProizvod?.grad || "",
            stavke: stavkeNarudzbine,
            ukupanIznos: pobjednickaPonuda.ukupanIznos,
            status: "u_stampi",
            datumNarucivanja: new Date()
        });
        await narudzbina.save();
        const klijent = await KorisnikModel.findById(nabavka.klijentId);
        if (klijent) {
            try {
                await posaljiFakture(klijent.mejl, [narudzbina]);
            } catch (err) {
                console.log("Greška pri slanju fakture za javnu nabavku:", err);
            }
        }
        nabavka.status = "zavrsena";
        nabavka.pobjednickaStamparijaId = pobjednickaPonuda.stamparijaId;
        nabavka.pobjednickaPonuda = pobjednickaPonuda.ukupanIznos;
        nabavka.narudzbinaId = narudzbina._id.toString();
        await nabavka.save();
    }

    izvjestaj = async (req: express.Request, res: express.Response) => {
        try {
            const nabavkaId = req.params.nabavkaId;
            const klijentId = req.params.klijentId;
            const nabavka = await JavnaNabavkaModel.findOne({ _id: nabavkaId, klijentId: klijentId, status: "zavrsena" });
            if (!nabavka) {
                return res.status(404).json({
                    message: "Završena javna nabavka nije pronađena."
                });
            }
            const pdf = await napraviIzvjestajJavneNabavke(nabavka);
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", 'attachment; filename="javna-nabavka-' + nabavka._id + '.pdf"');
            return res.send(pdf);
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Greška prilikom pravljenja izvještaja."
            });
        }
    }
}