export default class User {
    _id: string = "";

    kor_ime: string = "";
    lozinka: string = "";

    ime: string = "";
    prezime: string = "";
    telefon: string = "";
    mejl: string = "";

    profilna_slika: string = "";

    tip: string = "";
    status: string = "";

    naziv_institucije: string | null = null;
    adresa_sedista: string | null = null;
    maticni_broj: string | null = null;
    pib: string | null = null;

    resetPasswordToken: string | null = null;
    resetPasswordExpires: Date | null = null;
}