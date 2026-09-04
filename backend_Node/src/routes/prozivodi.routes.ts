import express from 'express';
import { ProizvodiController } from '../controllers/proizvodi.controller';
const proizvodiRouter = express.Router();

proizvodiRouter.route('/dohvatiProizvode').get(
    (req, res) => new ProizvodiController().dohvatiProizvode(req, res)
)

proizvodiRouter.route('/kupi').post(
    (req, res) => new ProizvodiController().kupi(req, res)
)

proizvodiRouter.route('/dohvatiProizvod/:naziv').get(
    (req, res) => new ProizvodiController().dohvatiProizvod(req, res)
)

proizvodiRouter.route('/komentarisi').post(
    (req, res) => new ProizvodiController().komentarisi(req, res)
)

proizvodiRouter.route('/odobri').post(
    (req, res) => new ProizvodiController().odobri(req, res)
)

proizvodiRouter.route('/odbaci').post(
    (req, res) => new ProizvodiController().odbaci(req, res)
)

proizvodiRouter.route('/unesi').post(
    (req, res) => new ProizvodiController().unesi(req, res)
)


export default proizvodiRouter;