import express from 'express';
import { UserController } from '../controllers/user.controller';
import multer from 'multer';

const userRouter = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },filename: function (req, file, cb) {
        const filename =Date.now() + "-" + file.originalname;
        cb(null, filename);
    }
});

const upload = multer({storage: storage});

userRouter.route('/login').post(
    (req, res) => new UserController().login(req, res)
)

userRouter.route('/adminLogin').post(
    (req, res) => new UserController().adminLogin(req, res)
);

userRouter.route('/register').post(
    upload.single("profilnaSlika"),
    (req, res) => new UserController().register(req, res)
)

userRouter.route('/forgotPassword').post(
    (req, res) => new UserController().forgotPassword(req, res)
);

userRouter.route('/resetPassword').post(
    (req, res) => new UserController().resetPassword(req, res)
);

userRouter.route('/dohvatiNeodobrene').get(
    (req, res) => new UserController().dohvatiNeodobrene(req, res)
);

userRouter.route('/prihvatiRegistraciju').post(
    (req, res) => new UserController().prihvatiRegistraciju(req, res)
);

userRouter.route('/odbijRegistraciju').post(
    (req, res) => new UserController().odbijRegistraciju(req, res)
);

userRouter.route('/profil/:username').get(
    (req, res) => new UserController().dohvatiProfil(req, res)
);

userRouter.route('/azurirajProfil').post(
    upload.single("profilnaSlika"),
    (req, res) => new UserController().azurirajProfil(req, res)
);

userRouter.route('/svi').get(
    (req, res) => new UserController().dohvatiSve( req, res )
);

userRouter.route('/obrisi/:id').delete(
    (req, res) => new UserController().obrisi( req, res )
);


userRouter.route('/admin/:id').get(
    (req, res) => new UserController().dohvatiPoId(req, res)
).put(
    (req, res) => new UserController().azurirajAdmin(req, res)
);

export default userRouter;