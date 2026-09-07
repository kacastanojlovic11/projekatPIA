import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import User from '../models/user';

@Component({
  selector: 'app-profil',
  imports: [FormsModule],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class Profil implements OnInit {
  private userService = inject(UserService);

  korisnik: User = new User();
  novaSlika: File | null = null;
  message: string = "";
  error: string = "";

  ngOnInit(): void {
    const sacuvaniKorisnik = localStorage.getItem("ulogovan");
    if(sacuvaniKorisnik){
      const ulogovan = JSON.parse(sacuvaniKorisnik);

      this.userService.dohvatiProfil(ulogovan.kor_ime).subscribe(res => {
        this.korisnik = res;
      })
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

}
