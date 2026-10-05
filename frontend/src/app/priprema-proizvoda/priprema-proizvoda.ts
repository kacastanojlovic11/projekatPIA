import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProizvodiService } from '../services/proizvodi.service';
import Proizvod from '../models/proizvod';
import { KorpaService } from '../services/korpa-service';
import StavkaKorpe from '../models/stavka-korpe';

@Component({
  selector: 'app-priprema-proizvoda',
  imports: [FormsModule],
  templateUrl: './priprema-proizvoda.html',
  styleUrl: './priprema-proizvoda.css',
})
export class PripremaProizvoda implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private proizvodiService = inject(ProizvodiService);
  private korpaService = inject(KorpaService);

  proizvod: Proizvod = new Proizvod();
  tekst: string = "";

  fajlZaStampu: File | null = null;
  slikaZaStampu: string = "";
  kolicina: number = 1;
  greskaKolicine: string = "";
  greskaSlike: string = "";
  greskaKorpa: string = "";
  izabranaBoja: string = "";
  izabranaUslugaId: string = "";
  glavnaSlika: string = "";

  ngOnInit(): void {
    const sifra = this.route.snapshot.paramMap.get("sifra");
    if (sifra) {
      this.proizvodiService.detalji(sifra).subscribe(res => {
        this.proizvod = res;
        this.ucitajGlavnuSliku();

        const boja = this.route.snapshot.queryParamMap.get("boja");

        if (boja) {
          this.izabranaBoja = boja;
        } else if (this.proizvod.dostupneBoje.length > 0) {
          this.izabranaBoja = this.proizvod.dostupneBoje[0];
        } else {
          this.izabranaBoja = "Bela";
        }

        const uslugaId = this.route.snapshot.queryParamMap.get("uslugaId");

        if (uslugaId) {
          this.izabranaUslugaId = uslugaId;
        } else if (this.proizvod.uslugeStampe.length > 0) {
          this.izabranaUslugaId = String(this.proizvod.uslugeStampe[0].idUsluge);
        }
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

    this.glavnaSlika = this.proizvod.slikaUrl;
  }

  ponisti(slikaInput: HTMLInputElement) {
    this.tekst = "";

    this.fajlZaStampu = null;
    this.slikaZaStampu = "";
    this.kolicina = 1;
    this.greskaSlike = "";
    this.greskaKolicine = "";
    slikaInput.value = "";
    this.greskaKorpa = "";
  }

  nazad() {
    this.router.navigate(["klijent", "detalji", this.proizvod.sifra])
  }

  izabranaSlika(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const fajl = input.files[0];

    const dozvoljeniFormati = [
      "image/jpeg",
      "image/png",
      "image/gif"
    ]

    if (!dozvoljeniFormati.includes(fajl.type)) {
      this.greskaSlike = "Slika mora biti JPG, PNG ili GIF.";
      input.value = "";
      return;
    }

    this.greskaSlike = "";
    this.fajlZaStampu = fajl;
    this.slikaZaStampu = "";

    const reader = new FileReader();

    reader.onload = () => {
      if (this.fajlZaStampu === fajl) {
        this.slikaZaStampu = reader.result as string;
      }
    };
    reader.readAsDataURL(fajl);
  }

  provjeriKolicinu() {
    this.greskaKolicine = "";
    if (!Number.isInteger(this.kolicina) || this.kolicina < 1) {
      this.greskaKolicine = "Količina mora biti pozitivan cijeli broj.";
    } else if (
      this.kolicina > this.proizvod.kolicinaNaLageru
    ) {
      this.greskaKolicine = "Нема довољно производа тренутно на стању";
    }
  }

  dodajUKorpu() {
    this.greskaKorpa = "";
    this.provjeriKolicinu();

    if (this.greskaKolicine) return;
    if (!this.proizvod.sifra) return;

    const usluga = this.proizvod.uslugeStampe.find(u => String(u.idUsluge) === this.izabranaUslugaId);

    if (!usluga) {
      this.greskaKorpa = "Izaberite vrstu štampe.";
      return;
    }

    let ukupnaKolicina = this.kolicina;

    for (let stavka of this.korpaService.stavke) {
      if (stavka.sifra === this.proizvod.sifra) {
        ukupnaKolicina += stavka.kolicina;
      }
    }

    if (ukupnaKolicina > this.proizvod.kolicinaNaLageru) {
      this.greskaKorpa = "Нема довољно производа тренутно на стању";
      return;
    }

    const stavka = new StavkaKorpe();

    stavka.sifra = this.proizvod.sifra;
    stavka.nazivProizvoda = this.proizvod.naziv;

    stavka.stamparijaId = this.proizvod.stamparijaId;
    stavka.nazivStamparije = this.proizvod.nazivStamparije;
    stavka.grad = this.proizvod.grad;

    stavka.boja = this.izabranaBoja;
    stavka.uslugaId = String(usluga.idUsluge);
    stavka.tipStampe = usluga.tipStampe;

    stavka.jedinicnaCena = this.proizvod.jedinicnaCena;
    stavka.dodatnaCenaPoKomadu = usluga.dodatnaCenaPoKomadu;

    stavka.kolicina = this.kolicina;

    stavka.ukupnaCena = (stavka.jedinicnaCena + stavka.dodatnaCenaPoKomadu) * stavka.kolicina;

    stavka.tekst = this.tekst;
    stavka.slikaZaStampu = this.slikaZaStampu;

    this.korpaService.dodaj(stavka);

    this.router.navigate(["klijent", "korpa"]);
  }
}
