import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import User from '../models/user';
import { NarudzbineService } from '../services/narudzbine-service';
import Narudzbina from '../models/narudzbina';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profil',
  imports: [FormsModule, DatePipe],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class Profil implements OnInit {
  private userService = inject(UserService);
  private narudzbineService = inject(NarudzbineService);

  korisnik: User = new User();
  novaSlika: File | null = null;
  message: string = "";
  error: string = "";

  narudzbine: Narudzbina[] = [];
  sortRastuce: boolean = true;

  messNarudzbina: string = "";
  errNarudzbina: string = "";

  tipKorisnika: string = "";

  ngOnInit(): void {
    const sacuvaniKorisnik = localStorage.getItem("ulogovan");
    if (sacuvaniKorisnik) {
      const ulogovan = JSON.parse(sacuvaniKorisnik);
      this.tipKorisnika = ulogovan.tip;
      this.userService.dohvatiProfil(ulogovan.kor_ime).subscribe(res => {
        this.korisnik = res;
      });

      if (this.tipKorisnika === "klijent_fizicko" || this.tipKorisnika === "klijent_pravno") {
        this.narudzbineService.dohvatiZaKlijenta(ulogovan._id).subscribe(response => {
          this.narudzbine = response;
          this.narudzbine.sort((a, b) => new Date(b.datumNarucivanja).getTime() - new Date(a.datumNarucivanja).getTime());
        });
      }
    }
  }

  izabranaSlika(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.novaSlika = input.files[0];
    }
  }
  sacuvaj() {
    this.message = "";
    this.error = "";
    this.userService.azurirajProfil(this.korisnik.kor_ime, this.korisnik.ime, this.korisnik.prezime, this.korisnik.telefon, this.korisnik.mejl, this.korisnik.naziv_institucije || "", this.korisnik.adresa_sedista || "", this.korisnik.maticni_broj || "", this.korisnik.pib || "", this.novaSlika).subscribe({
      next: response => {
        this.message = response.message;
        this.korisnik =response.korisnik;
        localStorage.setItem("ulogovan", JSON.stringify(response.korisnik));
      },
      error: err => {
        if (err.error && err.error.message) {
          this.error = err.error.message;
        } else {
          this.error = "Greška.";
        }
      }
    });
  }

  sortirajNarudzbine() {
    this.sortRastuce = !this.sortRastuce;
    if (this.sortRastuce) {
      this.narudzbine.sort( (a, b) => new Date(a.datumNarucivanja).getTime() - new Date(b.datumNarucivanja).getTime());
    } else {
      this.narudzbine.sort( (a, b) =>  new Date(b.datumNarucivanja).getTime() - new Date(a.datumNarucivanja).getTime());
    }
  }

  otkaziNarudzbinu(narudzbina: Narudzbina) {
    this.messNarudzbina = "";
    this.errNarudzbina = "";
    this.narudzbineService.otkazi(narudzbina._id).subscribe({
      next: response => {
        this.messNarudzbina = response.message;
        this.narudzbine = this.narudzbine.filter( n => n._id !== narudzbina._id);
      },error: err => {
        if (err.error && err.error.message) {
          this.errNarudzbina = err.error.message;
        } else {
          this.errNarudzbina = "Greška.";
        }
      }
    });
  }

}
