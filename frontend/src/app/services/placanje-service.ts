import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlacanjeService {
  
  private http = inject(HttpClient);

  uri = "http://localhost:4000/placanje";

  kreiraj(klijentId: string, narudzbineIds: string[]) {
    return this.http.post<any>(`${this.uri}/kreiraj`, {klijentId: klijentId, narudzbineIds: narudzbineIds});
  }

  provjeri(sessionId: string) {
    return this.http.post<any>(`${this.uri}/provjeri`, {sessionId: sessionId});
  }
}
