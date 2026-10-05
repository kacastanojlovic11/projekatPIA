import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JavneNabavkeService {

  private http = inject(HttpClient);
  uri = "http://localhost:4000/javne-nabavke";

  kreiraj(klijentId: string, stavke: any[]){
    return this.http.post<any>(`${this.uri}/kreiraj`,{
      klijentId: klijentId,
      stavke: stavke
    })
  }

  dohvatiZaKlijenta(klijentId: string){
    return this.http.get<any[]>(`${this.uri}/klijent/${klijentId}`);
  }

  dohvatiOtvorene(stamparijaId: string) {
    return this.http.get<any[]>(`${this.uri}/otvorene/${stamparijaId}`);
  }

  posaljiPonudu(nabavkaId: string, stamparijaId: string, stavke: any[]) {
    return this.http.post<any>(`${this.uri}/ponuda`,
      {
        nabavkaId: nabavkaId,
        stamparijaId: stamparijaId,
        stavke: stavke
      }
    );
  }

  izvjestaj(nabavkaId: string, klijentId: string) {
    return this.http.get(`${this.uri}/izvjestaj/${nabavkaId}/${klijentId}`, {responseType: "blob"});
  }
}
