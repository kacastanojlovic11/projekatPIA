import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import Narudzbina from '../models/narudzbina';
import ArhivskaStavka from '../models/arhiva-stavka';

@Injectable({
  providedIn: 'root',
})
export class NarudzbineService {

  private http = inject(HttpClient);
  uri = "http://localhost:4000/narudzbine";

  dohvatiZaKlijenta(klijentId: string){
    return this.http.get<Narudzbina[]>(`${this.uri}/klijent/${klijentId}`);
  }
  
  otkazi(id: string) {
    return this.http.post<any>(`${this.uri}/otkazi`,{id: id});
  }

  dohvatiArhivu(klijentId: string) {
    return this.http.get<ArhivskaStavka[]>(`${this.uri}/arhiva/${klijentId}`);
  }

  oznaciPrimljeno(fakturaId: string, klijentId: string) {
    return this.http.post<any>(`${this.uri}/primljeno`, {fakturaId: fakturaId, klijentId: klijentId});
  }

  dohvatiZaStampariju(stamparijaId: string) {
    return this.http.get<Narudzbina[]>(`${this.uri}/stamparija/${stamparijaId}`);
  }

  promijeniStatus(narudzbinaId: string, stamparijaId: string, noviStatus: string) {
    return this.http.post<any>(`${this.uri}/promijeni-status`,
      {
        narudzbinaId: narudzbinaId,
        stamparijaId: stamparijaId,
        noviStatus: noviStatus
      }
    );
  }
}
