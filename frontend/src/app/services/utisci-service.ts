import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import Utisak from '../models/utisak';

@Injectable({
  providedIn: 'root',
})
export class UtisciService {
  private http = inject(HttpClient);
  uri = "http://localhost:4000/utisci";

  sacuvaj(klijentId: string, sifra: string, reakcija: string, komentar: string) {
    return this.http.post<any>(`${this.uri}/sacuvaj`,
      {
        klijentId: klijentId,
        sifra: sifra,
        reakcija: reakcija,
        komentar: komentar
      }
    );
  }

  poslednjih5(sifra: string) {
    return this.http.get<Utisak[]>(`${this.uri}/poslednjih5/${sifra}`);
  }

  dohvatiZaKlijenta(klijentId: string) {
    return this.http.get<any[]>(`${this.uri}/klijent/${klijentId}`);
  }
}
