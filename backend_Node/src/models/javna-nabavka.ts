import mongoose from 'mongoose';
import kategorija from './kategorija';

const Schema = mongoose.Schema;

const StavkaNabavke = new Schema({
    sifra: String,
    nazivProizvoda: String,
    kategorija: String,
    potkategorija: String,
    kolicina: Number,
    boja: String,
    tipStampe: String,
    tekst: String,
    slikaZaStampu: String
}, {
    _id: false
});

const StavkaPonude = new Schema({
    trazenaSifra: String,
    ponudjeniProizvodSifra: String,
    nazivProizvoda: String,
    kolicina: Number,
    jedinicnaCena: Number,
    ukupnaCena: Number
}, {
    _id: false
});

const Ponuda = new Schema({
    stamparijaId: String,
    nazivStamparije: String,
    stavke: {
        type: [StavkaPonude],
        default: []
    },
    ukupanIznos: Number,
    datumPonude: {
        type: Date,
        default: Date.now
    }
}, {
    _id: false
});

const JavnaNabavka = new Schema({

    klijentId: {
        type: String,
        required: true
    },

    nazivInstitucije: {
        type: String,
        required: true
    },

    datumRaspisivanja: {
        type: Date,
        default: Date.now
    },

    datumIsteka: {
        type: Date,
        required: true
    },

    stavke: {
        type: [StavkaNabavke],
        default: []
    },

    ponude: {
        type: [Ponuda],
        default: []
    },

    status: {
        type: String,
        enum: [
            "otvorena",
            "zavrsena"
        ],
        default: "otvorena"
    },

    pobjednickaStamparijaId: {
        type: String,
        default: ""
    },

    pobjednickaPonuda: {
        type: Number,
        default: null
    },

    narudzbinaId: {
        type: String,
        default: ""
    }

});

export default mongoose.model('JavnaNabavkaModel', JavnaNabavka, 'javne_nabavke');