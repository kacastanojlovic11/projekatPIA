import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import User from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);

  uri = "http://localhost:4000/user";

  login(username: string, password: string) {
    const data = { username: username, password: password}
    return this.http.post<any>(`${this.uri}/login`, data)
  }

  adminLogin(username: string, password: string) {
    const data = {username, password};
    return this.http.post<any>(`${this.uri}/adminLogin`, data);
  }

  register(username: string, password: string, ime: string, prezime: string, telefon: string, email: string, profilnaSlika: File | null, tip: string, nazivInstitucije: string, adresaSedista: string, maticniBroj: string, pib: string) {
    const data = new FormData();
    data.append("username", username);
    data.append("password", password);

    data.append("ime", ime);
    data.append("prezime", prezime);
    data.append("telefon", telefon);
    data.append("email", email);

    data.append("tip", tip);

    data.append("nazivInstitucije", nazivInstitucije);
    data.append("adresaSedista", adresaSedista);
    data.append("maticniBroj", maticniBroj);

    data.append("pib", pib);

    if (profilnaSlika) {
      data.append("profilnaSlika", profilnaSlika);
    }
    return this.http.post<{message: string}>(`${this.uri}/register`, data);
  }

  forgotPassword(identifier: string) {
    const data = {identifier};
    return this.http.post<{message: string, resetLink: string}>(`${this.uri}/forgotPassword`, data);
  }

  resetPassword(token: string, password: string) {
    const data = {token, password};
    return this.http.post<{message: string}>(`${this.uri}/resetPassword`, data);
  }

  getPendingUsers() {
    return this.http.get<User[]>(`${this.uri}/dohvatiNeodobrene`);
  }

  approveUser(username: string) {
    const data = {username};
    return this.http.post<{ message: string }>(`${this.uri}/prihvatiRegistraciju`, data);
  }

  rejectUser(username: string) {
    const data = {username};
    return this.http.post<{ message: string }>(`${this.uri}/odbijRegistraciju`, data);
  }

  dohvatiProfil(username: string) {
    return this.http.get<User>(`${this.uri}/profil/${username}`);
  }

  azurirajProfil(username: string, ime: string, prezime: string, telefon: string, email: string, nazivInstitucije: string, adresaSedista: string, maticniBroj: string, pib: string, profilnaSlika: File | null) {
    const data = new FormData();
    data.append( "username", username);
    data.append( "ime", ime);
    data.append( "prezime", prezime);
    data.append( "telefon", telefon);
    data.append( "email", email);
    data.append( "nazivInstitucije", nazivInstitucije);
    data.append( "adresaSedista", adresaSedista);
    data.append( "maticniBroj", maticniBroj);
    data.append( "pib", pib);
    if (profilnaSlika) {
      data.append("profilnaSlika", profilnaSlika);
    }
    return this.http.post<any>(`${this.uri}/azurirajProfil`, data);
  }
}
