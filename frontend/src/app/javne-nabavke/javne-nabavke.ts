import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { JavneNabavkeService } from '../services/javne-nabavke-service';

@Component({
  selector: 'app-javne-nabavke',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './javne-nabavke.html',
  styleUrl: './javne-nabavke.css',
})
export class JavneNabavke implements OnInit{
  private javneNabavkeService = inject(JavneNabavkeService);

  nabavke: any[] = [];
  error: string = "";

  klijentId: string = "";

  ngOnInit(): void {
    const sacuvaniKorisnik = localStorage.getItem("ulogovan");
    if (!sacuvaniKorisnik) return;
    const korisnik = JSON.parse(sacuvaniKorisnik);
    this.klijentId = korisnik._id;
    this.javneNabavkeService.dohvatiZaKlijenta(korisnik._id).subscribe({
      next: res => {
        this.nabavke = res;
      }, error: err => {
        this.error = "Greška prilikom učitavanja javnih nabavki.";
      }
    });
  }

  preuzmiIzvjestaj( nabavka: any ) {
    this.error = "";
    this.javneNabavkeService.izvjestaj(nabavka._id, this.klijentId).subscribe({
      next: pdf => {
        const url = window.URL.createObjectURL(pdf);
        const link = document.createElement("a");
        link.href = url;
        link.download = "javna-nabavka-" + nabavka._id + ".pdf";
        link.click();
        window.URL.revokeObjectURL(url);
      }, error: err => {
        this.error = "Izvještaj nije moguće preuzeti.";
      }
    });
  }
}
