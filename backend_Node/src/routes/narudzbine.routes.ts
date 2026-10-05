import express from 'express';
import { NarudzbineController } from '../controllers/narudzbine.controller';

const narudzbineRouter = express.Router();

narudzbineRouter.route('/potvrdi').post(
    (req, res) => new NarudzbineController().potvrdi(req, res)
);

narudzbineRouter.route('/klijent/:klijentId').get(
    (req, res) => new NarudzbineController().dohvatiZaKlijenta(req, res)
);

narudzbineRouter.route('/otkazi').post(
    (req, res) => new NarudzbineController().otkazi(req, res)
);

narudzbineRouter.route('/arhiva/:klijentId').get(
    (req, res) => new NarudzbineController().arhiva(req, res)
);

narudzbineRouter.route('/primljeno').post(
    (req, res) => new NarudzbineController().oznaciPrimljeno(req, res)
);

narudzbineRouter.route('/stamparija/:stamparijaId').get(
    (req, res) => new NarudzbineController().dohvatiZaStampariju(req, res)
)

narudzbineRouter.route('/promijeni-status').post(
    (req, res) => new NarudzbineController().promijeniStatus(req, res)
)

export default narudzbineRouter;