import * as express from 'express';
import KorisnikModel from '../models/korisnik'
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { imageSize } from 'image-size';
import * as fs from 'fs';

export class UserController {
    login = async (req: express.Request, res: express.Response) => {
        try {
            const username = req.body.username;
            const password = req.body.password;

            const korisnik = await KorisnikModel.findOne({ kor_ime: username });

            if (!korisnik) {
                return res.status(401).json({
                    message: "Pogrešno korisničko ime ili lozinka."
                });
            }

            if (korisnik.tip === "admin") {
                return res.status(401).json({
                    message: "Pogrešno korisničko ime ili lozinka."
                });
            }

            const ispravnaLozinka = await bcrypt.compare(
                password,
                korisnik.lozinka
            );

            if (!ispravnaLozinka) {
                return res.status(401).json({
                    message: "Pogrešno korisničko ime ili lozinka."
                });
            }

            if (korisnik.status === "pending") {
                return res.status(403).json({
                    message: "Vaš zahtjev za registraciju još nije odobren."
                });
            }

            if (korisnik.status === "rejected") {
                return res.status(403).json({
                    message: "Vaš zahtjev za registraciju je odbijen."
                });
            }

            if (korisnik.status !== "active") {
                return res.status(403).json({
                    message: "Korisnički nalog nije aktivan."
                });
            }


            return res.status(200).json({
                korisnik: {
                    _id: korisnik._id,
                    kor_ime: korisnik.kor_ime,
                    ime: korisnik.ime,
                    prezime: korisnik.prezime,
                    telefon: korisnik.telefon,
                    mejl: korisnik.mejl,
                    profilna_slika: korisnik.profilna_slika,
                    tip: korisnik.tip,
                    status: korisnik.status,
                    naziv_institucije: korisnik.naziv_institucije,
                    adresa_sedista: korisnik.adresa_sedista,
                    maticni_broj: korisnik.maticni_broj,
                    pib: korisnik.pib
                }
            });

        } catch (err) {
            console.log(err);

            return res.status(500).json({
                message: "Greška prilikom prijavljivanja."
            });
        }
    }

    adminLogin = async (req: express.Request, res: express.Response) => {
        try {
            const username = req.body.username;
            const password = req.body.password;

            const korisnik = await KorisnikModel.findOne({kor_ime: username, tip: "admin"});

            if (!korisnik) {
                return res.status(401).json({message: "Pogrešno korisničko ime ili lozinka."});
            }

            const dobraLozinka = await bcrypt.compare(password, korisnik.lozinka);

            if (!dobraLozinka) {
                return res.status(401).json({message: "Pogrešno korisničko ime ili lozinka."});
            }

            return res.status(200).json({korisnik: {
                _id: korisnik._id,
                kor_ime: korisnik.kor_ime,
                ime: korisnik.ime,
                prezime: korisnik.prezime,
                tip: korisnik.tip
            }});
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Greška prilikom prijavljivanja." });
        }
    }

    register = async (req: express.Request, res: express.Response) => {
        try {
            const username = req.body.username;
            const password = req.body.password;
            const ime = req.body.ime;
            const prezime = req.body.prezime;
            const telefon = req.body.telefon;
            const email = req.body.email;
            const tip = req.body.tip;

            const nazivInstitucije = req.body.nazivInstitucije;
            const adresaSedista = req.body.adresaSedista;
            const maticniBroj = req.body.maticniBroj;
            const pib = req.body.pib;


            if (!username || !password || !ime || !prezime || !telefon || !email || !tip) {
                return res.status(400).json({message: "Nisu uneseni svi obavezni podaci."});
            }

            if (tip !== "klijent_fizicko" && tip !== "klijent_pravno" && tip !== "stamparija") {
                return res.status(400).json({message: "Neispravan tip korisnika."});
            }

            const passwordRegex = /^(?=.{8,12}$)(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])[A-Za-z].*$/;

            if (!passwordRegex.test(password)) {
                return res.status(400).json({
                    message: "Lozinka mora imati 8-12 karaktera, početi slovom i sadržati veliko slovo, broj i specijalni karakter."
                });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    message: "Email adresa nije ispravna."
                });
            }

            const postojeciKorisnik = await KorisnikModel.findOne({
                $or: [{ kor_ime: username }, { mejl: email }]
            });

            if (postojeciKorisnik) {

                if (postojeciKorisnik.kor_ime === username) {
                    return res.status(400).json({
                        message: "Korisničko ime već postoji."
                    });
                }

                return res.status(400).json({
                    message: "Već postoji nalog sa ovom email adresom."
                });
            }

            if (tip === "klijent_pravno" || tip === "stamparija") {

                if (!nazivInstitucije || !adresaSedista || !maticniBroj || !pib) {
                    return res.status(400).json({
                        message: "Nisu uneseni svi podaci o instituciji."
                    });
                }

                const maticniRegex = /^\d{8}$/;

                if (!maticniRegex.test(maticniBroj)) {
                    return res.status(400).json({
                        message: "Matični broj mora imati tačno 8 cifara."
                    });
                }

                const pibRegex = /^[1-9]\d{8}$/;

                if (!pibRegex.test(pib)) {
                    return res.status(400).json({
                        message: "PIB mora imati 9 cifara i ne smije početi nulom."
                    });
                }

                const postojecaInstitucija =
                    await KorisnikModel.findOne({
                        $or: [{ maticni_broj: maticniBroj }, { pib: pib }]
                    });

                if (postojecaInstitucija) {
                    return res.status(400).json({
                        message: "Institucija sa datim matičnim brojem ili PIB-om već postoji."
                    });
                }
            }

            const hashLozinke = await bcrypt.hash(password, 10);


            let profilnaSlika = "default_profile_image.jpg";

            if (req.file) {

                const dozvoljeniFormati = ["image/jpeg", "image/png", "image/gif"];

                if (!dozvoljeniFormati.includes(req.file.mimetype)) {
                    fs.unlinkSync(req.file.path);
                    return res.status(400).json({
                        message: "Profilna slika mora biti JPG, PNG ili GIF."
                    });
                }

                const imageBuffer = fs.readFileSync(req.file.path);
                const dimensions = imageSize(imageBuffer);

                if (!dimensions.width || !dimensions.height || dimensions.width < 100 ||
                    dimensions.height < 100 || dimensions.width > 250 || dimensions.height > 250) {
                    fs.unlinkSync(req.file.path);
                    return res.status(400).json({
                        message: "Profilna slika mora biti dimenzija od 100x100 do 250x250 piksela."
                    });
                }
                profilnaSlika = req.file.filename;
            }

            const noviKorisnik = new KorisnikModel({
                kor_ime: username,

                lozinka: hashLozinke,

                ime: ime,
                prezime: prezime,
                telefon: telefon,
                mejl: email,

                tip: tip,

                status: "pending",

                profilna_slika: profilnaSlika,

                naziv_institucije: tip === "klijent_fizicko" ? null : nazivInstitucije,

                adresa_sedista: tip === "klijent_fizicko" ? null : adresaSedista,

                maticni_broj: tip === "klijent_fizicko" ? null : maticniBroj,

                pib: tip === "klijent_fizicko" ? null : pib
            });


            await noviKorisnik.save();


            return res.status(200).json({
                message: "Zahtjev za registraciju je uspješno poslat. Čeka se odobrenje administratora."
            });

        } catch (err) {

            console.log(err);

            return res.status(500).json({
                message: "Greška prilikom registracije korisnika."
            });
        }
    }

    forgotPassword = async (req: express.Request, res: express.Response) => {
        try {
            const identifier = req.body.identifier;

            if (!identifier) {
                return res.status(400).json({ message: "Unesite korisničko ime ili email." });
            }

            const korisnik = await KorisnikModel.findOne({
                $or: [{ kor_ime: identifier }, { mejl: identifier }]
            });

            if (!korisnik) {
                return res.status(404).json({ message: "Korisnik nije pronađen." });
            }

            const token = crypto.randomBytes(32).toString("hex");
            const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
            korisnik.resetPasswordToken = tokenHash;
            korisnik.resetPasswordExpires = new Date(Date.now() + 5 * 60 * 1000);
            await korisnik.save();
            const resetLink = `http://localhost:4200/reset-password/${token}`;
            return res.status(200).json({
                message: "Reset link je kreiran.", resetLink: resetLink
            });
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Greška." });
        }
    }

    resetPassword = async (req: express.Request, res: express.Response) => {
        try {
            const token = req.body.token;
            const password = req.body.password;
            const passwordRegex = /^(?=.{8,12}$)(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])[A-Za-z].*$/;
            if (!passwordRegex.test(password)) {
                return res.status(400).json({message: "Lozinka mora imati 8-12 karaktera, početi slovom i sadržati veliko slovo, broj i specijalni karakter."});
            }

            const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

            const korisnik = await KorisnikModel.findOne({resetPasswordToken: tokenHash, resetPasswordExpires: { $gt: new Date()}});

            if (!korisnik) {
                return res.status(400).json({message: "Link nije ispravan ili je istekao."});
            }

            korisnik.lozinka = await bcrypt.hash(password, 10);

            korisnik.resetPasswordToken = null;
            korisnik.resetPasswordExpires = null;
            await korisnik.save();

            return res.status(200).json({ message: "Lozinka je uspješno promijenjena."});
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Greška." });
        }
    }

    dohvatiNeodobrene = async (req: express.Request, res: express.Response) => {
        try {
            const korisnici = await KorisnikModel.find({status: "pending"});
            return res.json(korisnici);
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({message: "Greška."});
        }
    }

    prihvatiRegistraciju = async (req: express.Request, res: express.Response) => {
        try {
            const username = req.body.username;
            const korisnik = await KorisnikModel.findOne({kor_ime: username});

            if (!korisnik) {
                return res.status(404).json({
                    message: "Korisnik nije pronađen."
                });
            }
            korisnik.status = "active";
            await korisnik.save();
            return res.json({message: "Registracija je prihvaćena."});
        }catch (err) {
            console.log(err);
            return res.status(500).json({message: "Greška."});
        }
    }

    odbijRegistraciju = async (req: express.Request, res: express.Response) => {
        try {
            const username = req.body.username;
            const korisnik = await KorisnikModel.findOne({kor_ime: username});

            if (!korisnik) {
                return res.status(404).json({
                    message: "Korisnik nije pronađen."
                });
            }
            korisnik.status = "rejected";
            await korisnik.save();
            return res.json({message: "Registracija je odbijena."});
        }catch (err) {
            console.log(err);
            return res.status(500).json({message: "Greška."});
        }
    }
}