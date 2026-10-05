import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Stavka = new Schema({
    sifra: String,
    nazivProizvoda: String,

    boja: String,
    uslugaId: String,
    tipStampe: String,

    jedinicnaCena: Number,
    dodatnaCenaPoKomadu: Number,
    kolicina: Number,
    ukupnaCena: Number,

    tekst: String,
    slikaZaStampu: String
});

const Narudzbina = new Schema({
    klijentId: String,

    stamparijaId: String,
    nazivStamparije: String,
    grad: String,

    stavke: [Stavka],
    ukupanIznos:  {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["naruceno", "placeno", "u_stampi", "isporuceno", "primljeno"],
        default: "naruceno"
    },
    datumNarucivanja: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('NarudzbinaModel', Narudzbina, 'narudzbine');