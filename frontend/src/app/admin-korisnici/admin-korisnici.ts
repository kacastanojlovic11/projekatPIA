import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import User from '../models/user';

@Component({
  selector: 'app-admin-korisnici',
  imports: [],
  templateUrl: './admin-korisnici.html',
  styleUrl: './admin-korisnici.css',
})
export class AdminKorisnici implements OnInit {

  private userService = inject(UserService);
  private router = inject(Router);

  korisnici: User[] = [];

  message: string = "";
  error: string = "";


  ngOnInit(): void {
    this.ucitaj();
  }

  ucitaj() {
    this.userService.dohvatiSve().subscribe({
      next: res => {
        this.korisnici = res;
      }, error: err => {
        this.error = "Greška prilikom učitavanja korisnika.";
      }
    });
  }

  izmijeni(korisnik: User) {
    this.router.navigate(["/admin/korisnik", korisnik._id]);
  }

  obrisi(korisnik: User) {
    const potvrda = confirm("Da li želite da obrišete korisnika " +  korisnik.kor_ime +  "?" );
    if (!potvrda) return;

    this.message = "";
    this.error = "";

    this.userService.obrisi(korisnik._id).subscribe({
      next: res => {
        this.message = res.message;
        this.korisnici = this.korisnici.filter(k => k._id !== korisnik._id);
      }, error: err => {
        if (err.error && err.error.message) {
          this.error = err.error.message;
        } else {
          this.error = "Greška prilikom brisanja korisnika.";
        }
      }
    });
  }
}
