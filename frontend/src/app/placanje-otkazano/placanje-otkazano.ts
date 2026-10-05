import { Component, inject } from '@angular/core';
import { PlacanjeService } from '../services/placanje-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-placanje-otkazano',
  imports: [],
  templateUrl: './placanje-otkazano.html',
  styleUrl: './placanje-otkazano.css',
})
export class PlacanjeOtkazano {

  private placanjeService = inject(PlacanjeService);
  private router = inject(Router);

  greska: string = "";

  ponovo() {
    const sacuvaniKorisnik = localStorage.getItem("ulogovan");
    const sacuvaneNarudzbine = localStorage.getItem("narudzbineZaPlacanje");
    if (!sacuvaniKorisnik || !sacuvaneNarudzbine) {
      this.greska = "Podaci za plaćanje nisu pronađeni.";
      return;
    }
    const korisnik = JSON.parse(sacuvaniKorisnik);
    const narudzbineIds = JSON.parse(sacuvaneNarudzbine);
    this.placanjeService.kreiraj(korisnik._id, narudzbineIds).subscribe({
      next: response => {
        if (response.url) {
          window.location.href = response.url;
        }
      }, error: err => {
        if (err.error && err.error.message) {
          this.greska = err.error.message;
        } else {
          this.greska = "Plaćanje nije moguće ponovo pokrenuti.";
        }
      }
    });
  }

  profil() {
    this.router.navigate(["profil"]);
  }
}
