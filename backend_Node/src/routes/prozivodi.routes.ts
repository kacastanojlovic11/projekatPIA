import express from 'express';
import { ProizvodiController } from '../controllers/proizvodi.controller';

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

export default proizvodiRouter;