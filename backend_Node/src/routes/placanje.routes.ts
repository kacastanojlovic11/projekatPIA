import express from 'express';

import {
    PlacanjeController
} from '../controllers/placanje.controller';

const placanjeRouter =
    express.Router();

placanjeRouter.route('/kreiraj').post(
    (req, res) => new PlacanjeController().kreiraj(req, res)
);

placanjeRouter.route('/provjeri').post(
    (req, res) => new PlacanjeController().provjeri(req, res)
);

export default placanjeRouter;