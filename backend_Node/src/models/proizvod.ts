import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const UslugaStampe = new Schema({
    idUsluge: String,
    tipStampe: String,
    dodatnaCenaPoKomadu: Number,
    maxSirinaMm: Number,
    maxVisinaMm: Number
})

const Proizvod = new Schema({
    sifra: {
        type: String,
        required: true,
        unique: true
    },
    stamparijaId: {
        type: String,
        required: true
    },
    nazivStamparije: {
        type: String,
        required: true
    },
    grad: {
        type: String,
        required: true
    },
    naziv: {
        type: String,
        required: true
    },
    opis: {
        type: String,
        required: true
    },
    kategorija: {
        type: String,
        required: true
    },
    potkategorija: {
        type: String,
        required: true
    },
    jedinicnaCena: {
        type: Number,
        required: true
    },
    kolicinaNaLageru: {
        type: Number,
        required: true
    },
    aktivan: {
        type: Boolean,
        default: true
    },
    dostupneBoje: [String],
    slikaUrl: {
        type: String,
        default: ""
    },
    dodatneSlike: [String],
    brojLajkova: {
        type: Number,
        default: 0
    },
    brojDislajkova: {
        type: Number,
        default: 0
    },
    uslugeStampe: [UslugaStampe]
})

export default mongoose.model('ProizvodModel', Proizvod, 'proizvodi');