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

  // odobri(proizvod: Proizvod, komentar: Komentari) {
  //   const data = { proizvod: proizvod, komentar: komentar }
  //   return this.http.post<Poruka>(`${this.uri}/odobri`, data)
  // }

  // odbaci(proizvod: Proizvod, komentar: Komentari) {
  //   const data = { proizvod: proizvod, komentar: komentar }
  //   return this.http.post<Poruka>(`${this.uri}/odbaci`, data)
  // }

  // unesi(novi: Proizvod) {
  //   const data = { naziv: novi.naziv, opis: novi.opis }
  //   return this.http.post<Poruka>(`${this.uri}/unesi`, data)
  // }
}
