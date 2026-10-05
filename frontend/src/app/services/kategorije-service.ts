import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import Kategorija from '../models/kategorija';

@Injectable({
  providedIn: 'root',
})
export class KategorijeService {
  private http = inject(HttpClient);
  uri = "http://localhost:4000/kategorije";

  dohvatiSve() {
    return this.http.get<Kategorija[]>(this.uri);
  }

  dodajKategoriju(naziv: string) {
    return this.http.post<any>(`${this.uri}/dodaj`, {naziv: naziv}
    );
  }

  dodajPotkategoriju(id: string, naziv: string) {
    return this.http.post<any>(`${this.uri}/dodaj-potkategoriju/${id}`, {naziv: naziv}
    );
  }

}
