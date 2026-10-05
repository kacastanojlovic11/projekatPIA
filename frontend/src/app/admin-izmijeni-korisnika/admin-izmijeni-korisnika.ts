import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import User from '../models/user';

@Component({
  selector: 'app-admin-izmijeni-korisnika',
  imports: [FormsModule],
  templateUrl: './admin-izmijeni-korisnika.html',
  styleUrl: './admin-izmijeni-korisnika.css',
})
export class AdminIzmijeniKorisnika implements OnInit {

  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  korisnik: User = new User();

  message: string = "";
  error: string = "";

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (!id) return;

    this.userService.dohvatiPoId(id).subscribe({
      next: res => {
        this.korisnik = res;
      }, error: err => {
        this.error = "Korisnik nije pronađen.";
      }
    });
  }

  sacuvaj() {

    this.message = "";
    this.error = "";

    this.userService.azurirajAdmin(this.korisnik._id, this.korisnik).subscribe({
      next: res => {
        this.message = res.message;
        this.korisnik = res.korisnik;
      }, error: err => {
        if (err.error && err.error.message) {
          this.error = err.error.message;
        } else {
          this.error = "Greška.";
        }
      }
    });
  }

  nazad() {
    this.router.navigate(["/admin/korisnici"]);
  }
  
}
