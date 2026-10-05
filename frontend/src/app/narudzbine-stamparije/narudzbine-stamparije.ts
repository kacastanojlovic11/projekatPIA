import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NarudzbineService } from '../services/narudzbine-service';
import Narudzbina from '../models/narudzbina';

@Component({
  selector: 'app-narudzbine-stamparije',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './narudzbine-stamparije.html',
  styleUrl: './narudzbine-stamparije.css',
})
export class NarudzbineStamparije implements OnInit{
  
  private narudzbineService = inject(NarudzbineService);
  narudzbine: Narudzbina[] = [];

  stamparijaId: string = "";

  message: string = "";
  error: string = "";

  ngOnInit(): void {
    const sacuvaniKorisnik = localStorage.getItem("ulogovan");
    if (!sacuvaniKorisnik) return;
    const korisnik = JSON.parse(sacuvaniKorisnik);
    this.stamparijaId = korisnik._id;
    this.ucitaj();
  }


  ucitaj() {
    this.narudzbineService.dohvatiZaStampariju(this.stamparijaId).subscribe({
      next: res => {
        this.narudzbine = res;
      }, error: err => {
        this.error = "Greška prilikom učitavanja narudžbina.";
      }
    });
  }
  
  promijeniStatus(narudzbina: Narudzbina, noviStatus: string) {
    this.message = "";
    this.error = "";

    this.narudzbineService.promijeniStatus(narudzbina._id, this.stamparijaId, noviStatus).subscribe({
      next: res => {
        this.message = res.message;
        narudzbina.status = res.narudzbina.status;
      }, error: err => {
        if (err.error && err.error.message) {
          this.error = err.error.message;
        } else {
          this.error = "Greška.";
        }
      }
    });
  }
}
