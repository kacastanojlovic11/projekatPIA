import express from 'express';
import { KategorijeController } from '../controllers/kategorije.controller';

const kategorijeRouter = express.Router();

kategorijeRouter.route('/').get(
    (req, res) => new KategorijeController().dohvatiSve(req, res)
);

kategorijeRouter.route('/dodaj').post(
    (req, res) => new KategorijeController().dodajKategoriju(req, res)
);

kategorijeRouter.route('/dodaj-potkategoriju/:id').post(
    (req, res) => new KategorijeController().dodajPotkategoriju(req, res)
);

export default kategorijeRouter;