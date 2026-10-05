import express from 'express';
import { UtisciController } from '../controllers/utisci.controller';

const utisciRouter = express.Router();

utisciRouter.route('/sacuvaj').post(
    (req, res) => new UtisciController().sacuvaj(req, res)
);

utisciRouter.route('/poslednjih5/:sifra').get(
    (req, res) => new UtisciController().poslednjih5(req, res)
);

utisciRouter.get('/klijent/:klijentId',
    (req, res) => new UtisciController().dohvatiZaKlijenta(req, res)
);

export default utisciRouter;