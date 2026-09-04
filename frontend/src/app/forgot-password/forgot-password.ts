import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  private userService = inject(UserService);

  identifier: string = "";
  error: string = "";
  message: string = "";
  resetLink: string = "";
  
  send(){
    this.error = "";
    this.message = "";
    this.resetLink = "";

    if(this.identifier === ""){
      this.error = "Unesite korisničko ime ili email.";
      return;
    }

    this.userService.forgotPassword(this.identifier).subscribe({
      next: (response) => {
        this.message = response.message;
        this.resetLink = response.resetLink;
      }, error: (err) => {
        if (err.error && err.error.message) {
          this.error = err.error.message;
        } else {
          this.error = "Greška.";
        }
      }
    })
  }
}
