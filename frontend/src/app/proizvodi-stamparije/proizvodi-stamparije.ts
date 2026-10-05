import { Component, inject, OnInit } from '@angular/core';
import { ProizvodiService } from '../services/proizvodi.service';
import Proizvod from '../models/proizvod';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proizvodi-stamparije',
  imports: [FormsModule],
  templateUrl: './proizvodi-stamparije.html',
  styleUrl: './proizvodi-stamparije.css',
})
export class ProizvodiStamparije implements OnInit{

  private router = inject(Router);
  private proizvodiService = inject(ProizvodiService);
  
  proizvodi: Proizvod[] = [];

  message: string = "";
  error: string = "";

  stamparijaId: string = "";


  ngOnInit(): void {
    const sacuvaniKorisnik = localStorage.getItem("ulogovan");
    if (!sacuvaniKorisnik) return;
    const korisnik = JSON.parse(sacuvaniKorisnik);
    this.stamparijaId = korisnik._id;
    this.ucitajProizvode();
  }

  ucitajProizvode() {
    this.proizvodiService.dohvatiZaStampariju(this.stamparijaId).subscribe({
      next: res => {
        this.proizvodi = res;
      }, error: err => {
        this.error = "Greška prilikom učitavanja proizvoda.";
      }
    });
  }

  sacuvajKolicinu(proizvod: Proizvod) {
    this.message = "";
    this.error = "";

    if (proizvod.kolicinaNaLageru < 0 || !Number.isInteger( proizvod.kolicinaNaLageru )) {
      this.error = "Količina mora biti nenegativan cijeli broj.";
      return;
    }

    this.proizvodiService.azurirajKolicinu(proizvod.sifra, this.stamparijaId, proizvod.kolicinaNaLageru).subscribe({
      next: res => {
        this.message = res.message;
      }, error: err => {
        if (err.error && err.error.message) {
          this.error = err.error.message;
        } else {
          this.error = "Greška.";
        }
      }
    });
  }

  dodajProizvod(){
    this.router.navigate(["/stamparija/dodaj-proizvod"])
  }

  dodajIzJson(){
    this.router.navigate(["/stamparija/dodaj-iz-json"])
  }

  dodajSlike(proizvod: Proizvod){
    this.router.navigate(["/stamparija/proizvod", proizvod.sifra, "slike"])
  }

}
