import express from 'express';

import {
    StatistikaController
} from '../controllers/statistika.controller';

const statistikaRouter = express.Router();

statistikaRouter.route('/promet-stamparija').get(
    (req, res) => new StatistikaController().prometStamparija(req, res)
);

statistikaRouter.route('/najcesci-proizvodi').get(
    (req, res) => new StatistikaController().najcesceNarucivaniProizvodi(req, res)
);

statistikaRouter.route('/ocjene-proizvoda').get(
    (req, res) => new StatistikaController().ocjeneProizvoda(req, res)
);

export default statistikaRouter;