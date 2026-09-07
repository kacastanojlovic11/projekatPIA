import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProizvodiService } from '../services/proizvodi.service';
import Proizvod from '../models/proizvod';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-proizvod-detalji',
  imports: [FormsModule],
  templateUrl: './proizvod-detalji.html',
  styleUrl: './proizvod-detalji.css',
})

export class ProizvodDetalji implements OnInit{

  private route = inject(ActivatedRoute);
  private proizvodiService = inject(ProizvodiService);

  private sanitizer = inject(DomSanitizer);

  proizvod: Proizvod = new Proizvod();
  glavnaSlika: string = "";
  sveSlike: string[] = [];

  klijentPrikaz: boolean = false;
  boje: string[] = [];
  izabranaBoja: string = "";
  izabranaUslugaID: string = "";

  mapaUrl: SafeResourceUrl | null = null;

  ngOnInit(): void {
    this.klijentPrikaz = this.route.snapshot.data['klijent'] === true;
    const sifra = this.route.snapshot.paramMap.get("sifra");

    if(sifra){
      this.proizvodiService.detalji(sifra).subscribe(res => {
        this.proizvod = res;

        if(this.proizvod.adresaStamparije){
          const adresa = this.proizvod.adresaStamparije;
          const url = "https://www.google.com/maps?q=" + encodeURIComponent(adresa) + "&output=embed";
          this.mapaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        }

        if(this.proizvod.dostupneBoje.length > 0){
          this.boje = this.proizvod.dostupneBoje;
        }else{
          this.boje = ["Bela"];
        }
        this.izabranaBoja = this.boje[0];
        if(this.proizvod.uslugeStampe.length > 0){
          this.izabranaUslugaID = this.proizvod.uslugeStampe[0].idUsluge;
        }

        this.sveSlike = [];
        if(this.proizvod.slikaUrl){
          this.sveSlike.push(this.proizvod.slikaUrl);
        }

        for(let slika of this.proizvod.dodatneSlike){
          this.sveSlike.push(slika);
        }
        this.ucitajGlavnuSliku();
      })
    }
  }

  ucitajGlavnuSliku() {
    const nazivCookie = "glavnaSlika_" + this.proizvod.sifra;
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const dijelovi = cookie.trim().split("=");
        if (dijelovi[0] === nazivCookie) {
          this.glavnaSlika = decodeURIComponent(dijelovi[1]);
          return;
        }
    }

    if (this.sveSlike.length > 0) {
        this.glavnaSlika = this.sveSlike[0];
    }
  }

  izaberiSliku(slika: string) {
    this.glavnaSlika = slika;
    const nazivCookie = "glavnaSlika_" + this.proizvod.sifra;
    document.cookie = nazivCookie + "=" + encodeURIComponent(slika) + "; path=/";
  }

}
