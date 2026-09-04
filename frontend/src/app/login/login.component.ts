import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private router = inject(Router)
  private userService = inject(UserService)

  username: string = "";
  password: string = "";
  error: string = "";

  login() {
    this.error = "";
    if (this.username == "" || this.password == "") {
      this.error = "Niste uneli sve podatke!";
      return;
    }
    this.userService.login(this.username, this.password).subscribe({ next: (response) => {
        localStorage.setItem("ulogovan", JSON.stringify(response.korisnik));

        if (response.korisnik.tip === "stamparija") {
          this.router.navigate(["stamparija"]);
        }else {
          this.router.navigate(["klijent"]);
        }
      },
      error: (err) => {if (err.error?.message) {
          this.error = err.error.message;
        } else {
          this.error = "Greška prilikom prijavljivanja.";
        }
      }
    })

  }
}
