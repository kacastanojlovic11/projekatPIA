import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JavneNabavkeService } from '../services/javne-nabavke-service';
import { ProizvodiService } from '../services/proizvodi.service';
import Proizvod from '../models/proizvod';

@Component({
  selector: 'app-licitacije-stamparije',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './licitacije-stamparije.html',
  styleUrl: './licitacije-stamparije.css',
})
export class LicitacijeStamparije implements OnInit {

  private javneNabavkeService = inject(JavneNabavkeService);
  private proizvodiService = inject(ProizvodiService);

  stamparijaId: string = "";
  nabavke: any[] = [];
  proizvodi: Proizvod[] = [];
  ponude: any = {};

  message: string = "";
  error: string = "";


  ngOnInit(): void {
    const sacuvaniKorisnik = localStorage.getItem("ulogovan");
    if (!sacuvaniKorisnik) return;
    const korisnik = JSON.parse(sacuvaniKorisnik);
    this.stamparijaId = korisnik._id;
    this.proizvodiService.dohvatiZaStampariju(this.stamparijaId).subscribe({
      next: res => {
        this.proizvodi = res;
      }
    });
    this.ucitajLicitacije();
  }

  ucitajLicitacije() {
    this.javneNabavkeService.dohvatiOtvorene(this.stamparijaId).subscribe({
      next: res => {
        this.nabavke = res;
        for (let nabavka of this.nabavke) {
          this.ponude[nabavka._id] = [];
          for (let i = 0; i < nabavka.stavke.length; i++) {
            this.ponude[nabavka._id][i] = { ponudjeniProizvodSifra: "", jedinicnaCena: 0 };
          }
        }
      }, error: err => {
        this.error = "Greška prilikom učitavanja licitacija.";
      }
    });
  }

  proizvodiZaStavku(stavka: any) {
    return this.proizvodi.filter(proizvod => proizvod.aktivan === true && proizvod.kategorija === stavka.kategorija && proizvod.potkategorija === stavka.potkategorija && proizvod.kolicinaNaLageru >= stavka.kolicina);
  }

  posaljiPonudu(nabavka: any) {
    this.message = "";
    this.error = "";
    const stavke: any[] = [];
    for (let i = 0; i < nabavka.stavke.length; i++) {
      const trazena = nabavka.stavke[i];
      const unos = this.ponude[nabavka._id][i];
      if ( !unos.ponudjeniProizvodSifra || unos.jedinicnaCena <= 0 ) {
        this.error = "Morate popuniti ponudu za sve proizvode.";
        return;
      }
      stavke.push({
        trazenaSifra: trazena.sifra,
        ponudjeniProizvodSifra: unos.ponudjeniProizvodSifra,
        jedinicnaCena: unos.jedinicnaCena
      });
    }
    this.javneNabavkeService.posaljiPonudu(nabavka._id, this.stamparijaId, stavke).subscribe({
      next: res => {
        this.message = res.message + " Ukupan iznos: " + res.ukupanIznos + " RSD.";
        nabavka.vecPonudio = true;
      }, error: err => {
        if (err.error && err.error.message) {
          this.error = err.error.message;
        } else {
          this.error = "Greška prilikom slanja ponude.";
        }
      }
    });
  }
}
