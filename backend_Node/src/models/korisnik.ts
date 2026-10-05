import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Korisnik = new Schema({
    kor_ime: {
        type: String,
        required: true,
        unique: true
    },
    lozinka: {
        type: String,
        required: true,
    },
    ime: {
        type: String,
        required: true
    },
    prezime: {
        type: String,
        required: true
    },
    telefon: String,
    mejl: {
        type: String,
        required: true,
        unique: true
    },
    profilna_slika: {
        type: String,
        default: "default_profile_image.jpg"
    },
    tip: {
        type: String,
        enum: [
            "klijent_fizicko",
            "klijent_pravno",
            "stamparija",
            "admin"
        ]
    },
    status: {
        type: String,
        enum: ["pending", "active", "rejected"],
        default: "pending"
    },
    
    naziv_institucije: String,
    adresa_sedista: String,
    grad: String,

    maticni_broj: {
        type: String,
        sparse: true
    },

    pib: {
        type: String,
        sparse: true
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date
})

export default mongoose.model('KorisnikModel', Korisnik, 'korisnici');