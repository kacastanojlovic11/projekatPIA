import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProizvodiService } from '../services/proizvodi.service';
import Proizvod from '../models/proizvod';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pocetna',
  imports: [FormsModule],
  templateUrl: './pocetna.html',
  styleUrl: './pocetna.css',
})
export class Pocetna implements OnInit {
  private proizvodiService = inject(ProizvodiService);

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  brojStamparija: number = 0;
  topProizvodi: Proizvod[] = [];
  kategorije: string[] = [];
  naziv: string = "";
  kategorija: string = "Sve kategorije";
  rezultati: Proizvod[] = [];
  sortRastuce: boolean = true;

  klijentPrikaz: boolean = false;

  ngOnInit(): void {
    this.klijentPrikaz = this.route.snapshot.data['klijent'] === true;
    this.dohvatiBrojStamparija();
    this.dohvatiTop5();
    this.dohvatiKategorije();
  }

  dohvatiBrojStamparija(){
    this.proizvodiService.brojStamparija().subscribe(res => {
      this.brojStamparija = res.broj;
    })
  }

  dohvatiTop5(){
    this.proizvodiService.top5().subscribe(res => {
      this.topProizvodi = res;
    })
  }

  dohvatiKategorije(){
    this.proizvodiService.kategorije().subscribe(res => {
      this.kategorije = res;
    })
  }

  pretrazi(){
    this.proizvodiService.pretraga(this.naziv, this.kategorija).subscribe(response => {
      this.rezultati = response;
      this.rezultati.sort((a, b) => a.naziv.localeCompare(b.naziv));
      this.sortRastuce = true;
    });
  }

  sortirajPoNazivu(){
    this.sortRastuce = !this.sortRastuce;
    if(this.sortRastuce){
      this.rezultati.sort((a,b) => 
        a.naziv.localeCompare(b.naziv)
      )
    }else{
      this.rezultati.sort((a,b) => 
        b.naziv.localeCompare(a.naziv)
      )
    }
  }

  detalji(proizvod: Proizvod){
    if(this.klijentPrikaz){
      this.router.navigate(["klijent", "detalji", proizvod.sifra])
    }else{
      this.router.navigate(["detalji", proizvod.sifra])
    }

    
  }
}
