import { Component, inject, Injector, OnInit } from '@angular/core';
import { KategorijeService } from '../services/kategorije-service';
import Kategorija from '../models/kategorija';
import { FormsModule } from '@angular/forms';
import { ProizvodiService } from '../services/proizvodi.service';
import { Router } from '@angular/router';

interface UslugaStampe {
  idUsluge: string;
  tipStampe: string;
  dodatnaCenaPoKomadu: number;
  maxSirinaMm: number;
  maxVisinaMm: number;
}

@Component({
  selector: 'app-dodaj-proizvod',
  imports: [FormsModule],
  templateUrl: './dodaj-proizvod.html',
  styleUrl: './dodaj-proizvod.css',
})
export class DodajProizvod implements OnInit{

  private kategorijeService = inject(KategorijeService);
  private proizvodiService = inject(ProizvodiService);
  private router = inject(Router);

  kategorije: Kategorija[] = [];
  potkategorije: string[] = [];

  sifra: string = "";
  naziv: string = "";
  opis: string = "";

  kategorija: string = "";
  potkategorija: string = "";

  grad: string = "";

  jedinicnaCena: number = 0;
  kolicinaNaLageru: number = 0;

  boje: string = "";

  usluge: UslugaStampe[] = [
    {
      idUsluge: "",
      tipStampe: "",
      dodatnaCenaPoKomadu: 0,
      maxSirinaMm: 0,
      maxVisinaMm: 0
    }
  ]

  glavnaSlika: File | null = null;
  dodatneSlike: File[] = [];

  message: string = "";
  error: string = "";

  ngOnInit(): void {
    this.kategorijeService.dohvatiSve().subscribe({
      next: res => {
        this.kategorije = res;
      }, error: err => {
        this.error = "Greška pri učitavanju kategorija.";
      }
    });
  }

  promijenjenaKategorija() {
    this.potkategorija = "";
    this.potkategorije = [];

    for (let kategorija of this.kategorije) {
      if (kategorija.naziv === this.kategorija) {
        this.potkategorije = kategorija.potkategorije;
        break;
      }
    }
  }

  dodajUslugu(){
    this.usluge.push({
      idUsluge: "",
      tipStampe: "",
      dodatnaCenaPoKomadu: 0,
      maxSirinaMm: 0,
      maxVisinaMm: 0
    })
  }

  ukloniUslugu(index: number){
    this.usluge.splice(index, 1);
  }

  izabranaGlavnaSlika(event: Event){
    const input = event.target as HTMLInputElement;

    if(input.files && input.files.length > 0){
      this.glavnaSlika = input.files[0];
    }
  }

  izabraneDodatneSlike(event: Event) {

    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    if (input.files.length > 3) {
      this.error = "Možete dodati najviše 3 dodatne slike.";
      input.value = "";
      return;
    }

    this.dodatneSlike = Array.from(input.files);
  }

  sacuvaj() {

    this.message = "";
    this.error = "";

    const sacuvaniKorisnik = localStorage.getItem("ulogovan");

    if (!sacuvaniKorisnik) {
      this.error = "Morate biti prijavljeni.";
      return;
    }

    if (!this.sifra || !this.naziv || !this.kategorija || !this.potkategorija || !this.grad) {
      this.error = "Popunite obavezna polja.";
      return;
    }

    if (this.jedinicnaCena < 0 || this.kolicinaNaLageru < 0 || !Number.isInteger(this.kolicinaNaLageru)) {
      this.error = "Cijena i količina nisu ispravne.";
      return;
    }

    const korisnik = JSON.parse(sacuvaniKorisnik);

    const dostupneBoje = this.boje.split(",").map(boja => boja.trim()).filter(boja => boja !== "");

    if (dostupneBoje.length === 0) {
      dostupneBoje.push("Bela");
    }

    const podaci = new FormData();

    podaci.append( "stamparijaId", korisnik._id);
    podaci.append( "sifra", this.sifra);
    podaci.append( "naziv", this.naziv);
    podaci.append( "opis", this.opis);
    podaci.append( "grad", this.grad);
    podaci.append("kategorija", this.kategorija);
    podaci.append( "potkategorija", this.potkategorija);
    podaci.append( "jedinicnaCena", this.jedinicnaCena.toString());
    podaci.append( "kolicinaNaLageru", this.kolicinaNaLageru.toString());
    podaci.append( "dostupneBoje", JSON.stringify(dostupneBoje));
    podaci.append( "uslugeStampe", JSON.stringify(this.usluge));

    if (this.glavnaSlika) {
      podaci.append( "glavnaSlika", this.glavnaSlika);
    }

    for (let slika of this.dodatneSlike) {
      podaci.append( "dodatneSlike", slika );
    }

    this.proizvodiService.dodajProizvod(podaci).subscribe({

        next: res => {
          this.message =res.message;
          this.router.navigate(["/stamparija/proizvodi"]);
        },

        error: err => {
          if (err.error && err.error.message) {
            this.error = err.error.message;
          } else {
            this.error = "Greška prilikom dodavanja proizvoda.";
          }
        }
      });
  }

}
