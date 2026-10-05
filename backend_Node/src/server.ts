import express, { Router } from 'express';
import cors from 'cors'
import mongoose from 'mongoose';
import userRouter from './routes/user.routes';
import proizvodiRouter from './routes/prozivodi.routes';
import narudzbineRouter from './routes/narudzbine.routes';

import 'dotenv/config';
import utisciRouter from './routes/utisci.routes';
import placanjeRouter from './routes/placanje.routes';
import kategorijeRouter from './routes/kategorije.routes';

import path from 'path';
import javneNabavkeRouter from './routes/javne-nabavke.routes';
import statistikaRouter from './routes/statistika.routes';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/projekatPIA")
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB connected")
})

const router = Router()
router.use('/user', userRouter)
router.use('/proizvodi', proizvodiRouter)
router.use('/narudzbine', narudzbineRouter)
router.use('/utisci', utisciRouter)
router.use('/placanje', placanjeRouter)
router.use('/kategorije', kategorijeRouter)
router.use('/javne-nabavke', javneNabavkeRouter)
router.use('/statistika', statistikaRouter)

app.use('/', router)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.listen(4000, () => console.log(`Express server running on port 4000`));