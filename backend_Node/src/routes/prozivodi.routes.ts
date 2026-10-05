import express from 'express';
import { ProizvodiController } from '../controllers/proizvodi.controller';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: path.join(__dirname, "../../uploads/proizvodi"),
    filename: (req, file, callback) => {
        const naziv = Date.now() + "-" + file.originalname;

        callback(null, naziv);
    }
});

const upload = multer({ storage: storage })
const uploadJSON = multer({storage: multer.memoryStorage()})

const proizvodiRouter = express.Router();

proizvodiRouter.route('/brojStamparija').get(
    (req, res) => new ProizvodiController().brojStamparija(req, res)
)

proizvodiRouter.route('/top5').get(
    (req, res) => new ProizvodiController().top5(req, res)
)

proizvodiRouter.route('/kategorije').get(
    (req, res) => new ProizvodiController().kategorije(req, res)
)

proizvodiRouter.route('/pretraga').post(
    (req, res) => new ProizvodiController().pretraga(req, res)
)

proizvodiRouter.route('/detalji/:sifra').get(
    (req, res) => new ProizvodiController().detalji(req, res)
);

proizvodiRouter.route('/stamparija/:stamparijaId').get(
    (req, res) => new ProizvodiController().dohvatiZaStampariju(req, res)
);

proizvodiRouter.route('/azuriraj-kolicinu').post(
    (req, res) => new ProizvodiController().azurirajKolicinu(req, res)
);

proizvodiRouter.route('/dodaj').post(
    upload.fields([
        {
            name: "glavnaSlika",
            maxCount: 1
        },
        {
            name: "dodatneSlike",
            maxCount: 3
        }
    ]), (req, res) => new ProizvodiController().dodaj(req, res)
)

proizvodiRouter.route('/dodaj-iz-json').post(
    uploadJSON.single("jsonFajl"),
    (req, res) => new ProizvodiController().dodajIzJson(req, res)
)

proizvodiRouter.route('/slike/:sifra').post(upload.fields([
    {
        name: "glavnaSlika",
        maxCount: 1
    },
    {
        name: "dodatneSlike",
        maxCount: 3
    }
]), (req, res) => new ProizvodiController().dodajSlike(req, res)
)

export default proizvodiRouter;