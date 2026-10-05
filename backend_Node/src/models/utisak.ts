import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Utisak = new Schema({

    klijentId: {
        type: String,
        required: true
    },
    kor_ime: {
        type: String,
        required: true
    },
    sifraProizvoda: {
        type: String,
        required: true
    },
    reakcija: {
        type: String,
        enum: ["like", "dislike"],
        required: true
    },
    komentar: {
        type: String,
        default: ""
    },
    datum: {
        type: Date,
        default: Date.now
    }
});

Utisak.index(
    {klijentId: 1, sifraProizvoda: 1},
    {unique: true}
);

export default mongoose.model('UtisakModel', Utisak, 'utisci');