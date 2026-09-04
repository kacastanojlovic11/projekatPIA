import express, { Router } from 'express';
import cors from 'cors'
import mongoose from 'mongoose';
import userRouter from './routes/user.routes';
import proizvodiRouter from './routes/prozivodi.routes';

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

app.use('/', router)
app.use("/uploads", express.static("uploads"));

app.listen(4000, () => console.log(`Express server running on port 4000`));