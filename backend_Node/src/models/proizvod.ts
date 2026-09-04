import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Kupovina = new Schema({
    kupac: String,
    kolicina: Number,
    velicina: String
})

let Komentar = new Schema({
    kupac: String,
    tekst: String,
    status: String
})

let Proizvod = new Schema({
    id: Number,
    naziv: String,
    opis: String,
    kupovine: [Kupovina],
    komentari: [Komentar]
})

export default mongoose.model('ProizvodModel', Proizvod, 'proizvodi');