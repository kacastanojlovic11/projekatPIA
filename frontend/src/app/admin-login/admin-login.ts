import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css',
})
export class AdminLogin {

  private userService = inject(UserService);
  private router = inject(Router);

  username: string = "";
  password: string = "";
  error: string = "";

  login(){
    this.error = "";

    if(this.username === "" || this.password ===""){
      this.error = "Unesite korisničko ime i lozinku.";
      return;
    }

    this.userService.adminLogin(this.username, this.password).subscribe({
      next: (response) => {
        localStorage.setItem("admin", JSON.stringify(response.korisnik));

        this.router.navigate(["admin"]);
      }, error: (err) => {
        if(err.error && err.error.message){
          this.error = err.error.message;
        }else{
          this.error = "Greška.";
        }
      }
    });
  }

}
