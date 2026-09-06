import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProizvodiService } from '../services/proizvodi.service';
import Proizvod from '../models/proizvod';

@Component({
  selector: 'app-proizvod-detalji',
  imports: [],
  templateUrl: './proizvod-detalji.html',
  styleUrl: './proizvod-detalji.css',
})

export class ProizvodDetalji implements OnInit{

  private route = inject(ActivatedRoute);
  private proizvodiService = inject(ProizvodiService);

  proizvod: Proizvod = new Proizvod();
  glavnaSlika: string = "";
  sveSlike: string[] = [];

  ngOnInit(): void {
    const sifra = this.route.snapshot.paramMap.get("sifra");

    if(sifra){
      this.proizvodiService.detalji(sifra).subscribe(res => {
        this.proizvod = res;
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
