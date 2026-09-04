import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
// import { Komentari, Kupovine, Proizvod } from '../models/proizvod';
// import { Poruka } from '../models/poruka';

@Injectable({
  providedIn: 'root'
})
export class ProizvodiService {

  // private http = inject(HttpClient);

  // uri = "http://localhost:4000/proizvodi";

  // dohvatiProizvode() {
  //   return this.http.get<Proizvod[]>(`${this.uri}/dohvatiProizvode`)
  // }

  // kupi(kupovina: Kupovine, naziv: string) {
  //   const data = { kupovina: kupovina, naziv: naziv }
  //   return this.http.post<Poruka>(`${this.uri}/kupi`, data)
  // }

  // dohvatiProizvod(naziv: string) {
  //   return this.http.get<Proizvod>(`${this.uri}/dohvatiProizvod/${naziv}`)
  // }

  // komentarisi(komentar: Komentari, naziv: string) {
  //   const data = { komentar: komentar, naziv: naziv }
  //   return this.http.post<Poruka>(`${this.uri}/komentarisi`, data)
  // }

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
