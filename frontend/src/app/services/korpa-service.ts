import { inject, Injectable } from '@angular/core';
import StavkaKorpe from '../models/stavka-korpe';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class KorpaService {

  private http = inject(HttpClient);
  stavke: StavkaKorpe[] = [];
  uri = "http://localhost:4000/narudzbine";

  dodaj(stavka: StavkaKorpe){
    this.stavke.push(stavka);
  }

  potvrdi(klijentId: string){
    return this.http.post<any>(`${this.uri}/potvrdi`, { klijentId: klijentId, stavke: this.stavke});
  }
  
}
