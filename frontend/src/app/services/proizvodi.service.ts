import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import Proizvod from '../models/proizvod';

@Injectable({
  providedIn: 'root'
})
export class ProizvodiService {

  private http = inject(HttpClient);

  uri = "http://localhost:4000/proizvodi";

  brojStamparija() {
    return this.http.get<{broj: number}>(`${this.uri}/brojStamparija`)
  }

  top5() {
    return this.http.get<Proizvod[]>(`${this.uri}/top5`)
  }

  kategorije() {
    return this.http.get<string[]>(`${this.uri}/kategorije`)
  }

  pretraga(naziv: string, kategorija: string) {
    const data = { naziv: naziv, kategorija: kategorija }
    return this.http.post<Proizvod[]>(`${this.uri}/pretraga`, data)
  }

  detalji(sifra: string) {
    return this.http.get<Proizvod>(`${this.uri}/detalji/${sifra}`);
  }

  dohvatiZaStampariju(stamparijaId: string) {
    return this.http.get<any[]>(`${this.uri}/stamparija/${stamparijaId}`);
  }
  
  azurirajKolicinu(sifra: string, stamparijaId: string, kolicina: number) {
    return this.http.post<any>(`${this.uri}/azuriraj-kolicinu`, {sifra: sifra, stamparijaId: stamparijaId, kolicina: kolicina});
  }

  dodajProizvod(podaci: FormData) {
    return this.http.post<any>(`${this.uri}/dodaj`, podaci);
  }

  dodajIzJson(stamparijaId: string, jsonFajl: File) {
    const podaci = new FormData();
    podaci.append("stamparijaId", stamparijaId);
    podaci.append("jsonFajl", jsonFajl);
    return this.http.post<any>(`${this.uri}/dodaj-iz-json`, podaci);
  }

  dodajSlike(sifra: string, stamparijaId: string, glavnaSlika: File | null, dodatneSlike: File[]) {
    const podaci = new FormData();
    podaci.append("stamparijaId", stamparijaId);
    if (glavnaSlika) {
      podaci.append("glavnaSlika", glavnaSlika);
    }
    for (let slika of dodatneSlike) {
      podaci.append("dodatneSlike", slika);
    }
    return this.http.post<any>(`${this.uri}/slike/${sifra}`, podaci);
  }
}
