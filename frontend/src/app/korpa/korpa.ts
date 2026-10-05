import { Component, inject } from '@angular/core';
import { KorpaService } from '../services/korpa-service';
import { PlacanjeService } from '../services/placanje-service';
import { JavneNabavkeService } from '../services/javne-nabavke-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-korpa',
  imports: [],
  templateUrl: './korpa.html',
  styleUrl: './korpa.css',
})
export class Korpa {
  korpaService = inject(KorpaService);
  private placanjeService = inject(PlacanjeService);
  private javneNabavkeService = inject(JavneNabavkeService);
  private router = inject(Router);

  message: string = "";
  error: string = "";

  dohvatiStamparije(): string[]{
    const stamparije: string[] = [];
    for(let stavka of this.korpaService.stavke){
      if(!stamparije.includes(stavka.stamparijaId)){
        stamparije.push(stavka.stamparijaId);
      }
    }
    return stamparije;
  }

  ukupnoZaStampariju(stamparijaId: string): number {
    let ukupno = 0;
    for(let stavka of this.korpaService.stavke){
      if(stavka.stamparijaId === stamparijaId){
        ukupno += stavka.ukupnaCena;
      }
    }
    return ukupno;
  }

  ukupnoKorpa(): number {
    let ukupno = 0;
    for(let stavka of this.korpaService.stavke){
      ukupno += stavka.ukupnaCena;
    }
    return ukupno;
  }

  nazivStamparije(stamparijaId: string): string{
    for(let stavka of this.korpaService.stavke){
      if(stavka.stamparijaId === stamparijaId){
        return stavka.nazivStamparije;
      }
    }
    return "";
  }

  ukloni(index: number){
    this.korpaService.stavke.splice(index, 1);
  }

  potvrdi() {
    this.message = "";
    this.error = "";
    const sacuvaniKorisnik = localStorage.getItem("ulogovan");

    if (!sacuvaniKorisnik) {
      this.error = "Morate biti prijavljeni.";
      return;
    }

    const korisnik = JSON.parse(sacuvaniKorisnik);
    if (korisnik.tip === "klijent_pravno") {
      this.javneNabavkeService.kreiraj(korisnik._id, this.korpaService.stavke).subscribe({
        next: res => {
          this.message = res.message;
          this.korpaService.stavke = [];
          this.router.navigate(["/klijent/javne-nabavke"]);
        }, error: err => {
          if (err.error && err.error.message) {
            this.error = err.error.message;
          } else {
            this.error = "Greška prilikom raspisivanja javne nabavke.";
          }
        }
      });
      return;
    }
    
    this.korpaService.potvrdi(korisnik._id).subscribe({
      next: res => {
        const narudzbineIds: string[] = [];
        for (let narudzbina of res.narudzbine) { 
          narudzbineIds.push(narudzbina._id);
        }
        localStorage.setItem("narudzbineZaPlacanje", JSON.stringify(narudzbineIds));
        this.korpaService.stavke = [];
        this.placanjeService.kreiraj(korisnik._id, narudzbineIds).subscribe({
          next: odgovor => {
            if (odgovor.url) {
              window.location.href = odgovor.url;
            }
          },error: err => {
            if (err.error && err.error.message) {
              this.error = err.error.message;
            } else {
              this.error = "Narudžbine su napravljene, ali plaćanje nije pokrenuto.";
            }
          }
        });
      },error: err => {
        if (err.error && err.error.message) {
          this.error = err.error.message;
        } else {
          this.error = "Greška prilikom potvrde narudžbine.";
        }
      }
    });
  }
}
