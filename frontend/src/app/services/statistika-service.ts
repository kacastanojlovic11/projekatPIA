import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StatistikaService {

  private http = inject(HttpClient);

  private uri = 'http://localhost:4000/statistika';

  prometStamparija() {
    return this.http.get<any[]>(`${this.uri}/promet-stamparija`);
  }

  najcesciProizvodi() {
    return this.http.get<any[]>(`${this.uri}/najcesci-proizvodi`);
  }

  ocjeneProizvoda() {
    return this.http.get<any[]>(`${this.uri}/ocjene-proizvoda`);
  }
}
