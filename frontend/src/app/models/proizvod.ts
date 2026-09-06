export default class Proizvod {
    _id: string = "";
    sifra: string = "";
    stamparijaId: string = "";
    nazivStamparije: string = "";
    grad: string = "";
    naziv: string = "";
    opis: string = "";
    kategorija: string = "";
    potkategorija: string = "";
    jedinicnaCena: number = 0;
    kolicinaNaLageru: number = 0;
    aktivan: boolean = true;
    dostupneBoje: string[] = [];
    slikaUrl: string = "";
    dodatneSlike: string[] = [];
    brojLajkova: number = 0;
    brojDislajkova: number = 0;
    uslugeStampe: any[] = [];
}