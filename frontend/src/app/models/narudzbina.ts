export default class Narudzbina {
    _id: string = "";
    klijentId: string = "";

    stamparijaId: string = "";
    nazivStamparije: string = "";
    grad: string = "";

    stavke: any[] = [];
    ukupanIznos: number = 0;
    status: string = "";
    datumNarucivanja: Date = new Date();
}