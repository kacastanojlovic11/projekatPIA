import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-reset-password',
  imports: [ FormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  token: string = "";
  password: string = "";
  confirmPassword: string = "";
  error: string = "";
  message: string = "";

  constructor(){
    let tokenFromUrl = this.route.snapshot.paramMap.get("token");
    if (tokenFromUrl) {
      this.token = tokenFromUrl;
    }else {
      this.token = "";
    }
  }

  reset(){
    this.error = "";

    if(this.password !== this.confirmPassword){
      this.error = "Lozinke se ne poklapaju.";
      return;
    }

    this.userService.resetPassword(this.token, this.password).subscribe({
      next: (response) => {
        this.message = response.message;
        setTimeout(()=> {
          this.router.navigate(["/login"]);
        }, 500);
      }, error: (err) => {
        if (err.error && err.error.message) {
          this.error = err.error.message;
        } else {
          this.error = "Greška.";
        }
      }
    });
  }
}
