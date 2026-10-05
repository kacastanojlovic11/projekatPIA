import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KategorijeService } from '../services/kategorije-service';

@Component({
  selector: 'app-admin-kategorije',
  imports: [FormsModule],
  templateUrl: './admin-kategorije.html',
  styleUrl: './admin-kategorije.css',
})
export class AdminKategorije implements OnInit {

  private kategorijeService = inject(KategorijeService);

  kategorije: any[] = [];
  novaKategorija: string = "";
  novaPotkategorija: {[id: string]: string} = {};

  message: string = "";
  error: string = "";

  ngOnInit(): void {
    this.ucitajKategorije();
  }

  ucitajKategorije() {
    this.kategorijeService.dohvatiSve().subscribe({
      next: res => { this.kategorije = res; },
      error: err => {
        this.error = "Greška prilikom učitavanja kategorija.";
      }
    });
  }

  dodajKategoriju() {

    this.message = "";
    this.error = "";

    this.kategorijeService.dodajKategoriju(this.novaKategorija).subscribe({
      next: res => {
        this.message = res.message;
        this.novaKategorija = "";
        this.ucitajKategorije();
      }, error: err => {
        this.error = err.error?.message || "Greška.";
      }
    });
  }

  dodajPotkategoriju(id: string) {

    this.message = "";
    this.error = "";

    const naziv = this.novaPotkategorija[id];

    this.kategorijeService.dodajPotkategoriju(id, naziv).subscribe({
      next: res => {
        this.message = res.message;
        this.novaPotkategorija[id] = "";
        this.ucitajKategorije();
      }, error: err => {
        this.error = err.error?.message || "Greška.";
      }
    });
  }
}
