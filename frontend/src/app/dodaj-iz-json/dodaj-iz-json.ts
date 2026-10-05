import { Component, inject } from '@angular/core';
import { ProizvodiService } from '../services/proizvodi.service';

@Component({
  selector: 'app-dodaj-iz-json',
  imports: [],
  templateUrl: './dodaj-iz-json.html',
  styleUrl: './dodaj-iz-json.css',
})
export class DodajIzJson {

  private proizvodiService = inject(ProizvodiService);
  jsonFajl: File | null = null;

  message: string = "";
  error: string = "";

  dodateSifre: string[] = [];

  izabranFajl(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const fajl = input.files[0];
      if (!fajl.name.toLowerCase().endsWith(".json")) {
        this.error = "Morate izabrati JSON fajl.";
        input.value = "";
        return;
      }
      this.error = "";
      this.jsonFajl = fajl;
    }
  }

  ucitaj() {

    this.message = "";
    this.error = "";

    if (!this.jsonFajl) {
      this.error = "Izaberite JSON fajl.";
      return;
    }

    const sacuvaniKorisnik = localStorage.getItem("ulogovan");
    if (!sacuvaniKorisnik) {
      this.error = "Morate biti prijavljeni.";
      return;
    }

    const korisnik = JSON.parse(sacuvaniKorisnik);
    this.proizvodiService.dodajIzJson( korisnik._id, this.jsonFajl).subscribe({
      next: res => {
        this.message = res.message;
        this.dodateSifre = res.sifre;
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
