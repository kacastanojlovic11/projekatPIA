import express from 'express';
import { JavneNabavkeController } from '../controllers/javne-nabavke.controller';

const javneNabavkeRouter = express.Router();
javneNabavkeRouter.route('/kreiraj').post(
    (req, res) => new JavneNabavkeController().kreiraj(req, res)
);

javneNabavkeRouter.route('/klijent/:klijentId').get(
    (req, res) => new JavneNabavkeController().dohvatiZaKlijenta(req, res)
);

javneNabavkeRouter.route('/otvorene/:stamparijaId').get(
    (req, res) => new JavneNabavkeController().dohvatiOtvorene(req, res)
);

javneNabavkeRouter.route('/ponuda').post(
    (req, res) => new JavneNabavkeController().posaljiPonudu(req, res)
);

javneNabavkeRouter.route('/izvjestaj/:nabavkaId/:klijentId').get(
    (req, res) => new JavneNabavkeController().izvjestaj(req, res)
)

export default javneNabavkeRouter;