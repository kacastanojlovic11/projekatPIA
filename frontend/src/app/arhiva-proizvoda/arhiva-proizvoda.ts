import { Component, inject, OnInit } from '@angular/core';
import { NarudzbineService } from '../services/narudzbine-service';
import ArhivskaStavka from '../models/arhiva-stavka';
import { FormsModule } from '@angular/forms';
import { UtisciService } from '../services/utisci-service';

@Component({
  selector: 'app-arhiva-proizvoda',
  imports: [FormsModule],
  templateUrl: './arhiva-proizvoda.html',
  styleUrl: './arhiva-proizvoda.css',
})
export class ArhivaProizvoda implements OnInit {
  private narudzbineService = inject(NarudzbineService);
  private utisciService = inject(UtisciService);

  stavke: ArhivskaStavka[] = [];
  klijentId: string = "";
  sortiranje: string = "datum";
  rastuce: boolean = false;
  poruka: string = "";
  greska: string = "";
  komentari: { [sifra: string]: string } = {}
  reakcije: { [sifra: string]: string } = {};

  ngOnInit(): void {

    const sacuvaniKorisnik = localStorage.getItem("ulogovan");
    if (!sacuvaniKorisnik) return;
    
    const korisnik = JSON.parse(sacuvaniKorisnik);
    this.klijentId = korisnik._id;

    this.utisciService.dohvatiZaKlijenta(this.klijentId).subscribe(utisci => {

      for (let utisak of utisci) {
        this.reakcije[utisak.sifraProizvoda] = utisak.reakcija;
        this.komentari[utisak.sifraProizvoda] = utisak.komentar;
      }

    });

    this.narudzbineService.dohvatiArhivu(this.klijentId).subscribe(response => {
      this.stavke = response;
      this.sortiraj();
    });
  }

  sortiraj() {
    if (this.sortiranje === "datum") {
      this.stavke.sort((a, b) => {
        const datumA = new Date(a.datumNarucivanja).getTime();
        const datumB = new Date(b.datumNarucivanja).getTime();
        if (this.rastuce) {
          return datumA - datumB;
        } else {
          return datumB - datumA;
        }
      });
    } else if (this.sortiranje === "naziv") {
      this.stavke.sort((a, b) => {
        if (this.rastuce) {
          return a.nazivProizvoda.localeCompare(b.nazivProizvoda);
        } else {
          return b.nazivProizvoda.localeCompare(a.nazivProizvoda);
        }
      });
    } else if (this.sortiranje === "kolicina") {
      this.stavke.sort((a, b) => {
        if (this.rastuce) {
          return a.kolicina - b.kolicina;
        } else {
          return b.kolicina - a.kolicina;
        }
      });
    } else if (this.sortiranje === "stamparija") {
      this.stavke.sort((a, b) => {
        if (this.rastuce) {
          return a.nazivStamparije.localeCompare(b.nazivStamparije);
        } else {
          return b.nazivStamparije.localeCompare(a.nazivStamparije);
        }
      });
    }
  }

  promijeniSmjer() {
    this.rastuce = !this.rastuce;
    this.sortiraj();
  }

  primi(stavka: ArhivskaStavka) {
    this.poruka = "";
    this.greska = "";

    this.narudzbineService.oznaciPrimljeno(stavka.fakturaId, this.klijentId).subscribe({
      next: response => {
        this.poruka = response.message;
        for (let s of this.stavke) {
          if (s.fakturaId === stavka.fakturaId) {
            s.status = "primljeno";
          }
        }
      }, error: err => {
        if (err.error && err.error.message) {
          this.greska = err.error.message;
        } else {
          this.greska = "Greška.";
        }
      }
    });
  }

  ocijeni(stavka: ArhivskaStavka, reakcija: string) {
    this.poruka = "";
    this.greska = "";

    let komentar = "";

    if (this.komentari[stavka.sifra]) {
      komentar = this.komentari[stavka.sifra];
    }

    this.utisciService.sacuvaj(this.klijentId, stavka.sifra, reakcija, komentar).subscribe({
      next: response => {
        this.poruka = response.message;
        this.komentari[stavka.sifra] = "";
        this.reakcije[stavka.sifra] = reakcija;

      }, error: err => {
        if (err.error && err.error.message) {
          this.greska = err.error.message;
        } else {
          this.greska = "Greška.";
        }
      }
    });
  }

}

