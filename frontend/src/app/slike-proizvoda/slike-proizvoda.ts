import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProizvodiService } from '../services/proizvodi.service';

@Component({
  selector: 'app-slike-proizvoda',
  imports: [],
  templateUrl: './slike-proizvoda.html',
  styleUrl: './slike-proizvoda.css',
})
export class SlikeProizvoda {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private proizvodiService = inject(ProizvodiService);

  sifra: string = "";
  glavnaSlika: File | null = null;
  dodatneSlike: File[] = [];

  message: string = "";
  error: string = "";

  constructor() {
    this.sifra = this.route.snapshot.paramMap.get("sifra") || "";
  }

  izabranaGlavnaSlika(event: Event) {
    const input =  event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
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
    this.error = "";
    this.dodatneSlike = Array.from(input.files);
  }

  sacuvaj() {
    this.message = "";
    this.error = "";
    if (!this.glavnaSlika && this.dodatneSlike.length === 0) {
      this.error = "Izaberite najmanje jednu sliku.";
      return;
    }
    
    const sacuvaniKorisnik = localStorage.getItem("ulogovan");
    if (!sacuvaniKorisnik) {
      this.error = "Morate biti prijavljeni.";  
      return;
    }
    const korisnik = JSON.parse(sacuvaniKorisnik);
    this.proizvodiService.dodajSlike(this.sifra, korisnik._id, this.glavnaSlika, this.dodatneSlike).subscribe({
      next: res => {
        this.message = res.message;
        this.router.navigate(["/stamparija/proizvodi"]);
      }, error: err => {
        if (err.error && err.error.message) {
          this.error = err.error.message;
        } else {
          this.error = "Greška prilikom dodavanja slika.";
        }
      }
    });
  }
}
