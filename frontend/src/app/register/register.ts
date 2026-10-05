import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  private userService = inject(UserService);
  private router = inject(Router);

  username: string = "";
  password: string = "";

  ime: string = "";
  prezime: string = "";
  telefon: string = "";
  email: string = "";

  profilnaSlika: File | null = null;

  tip: string = "klijent_fizicko";

  nazivInstitucije: string = "";
  adresaSedista: string = "";
  maticniBroj: string = "";
  pib: string = "";

  error: string = "";
  message: string = "";

  grad: string = "";

  register() {
    this.error = "";
    this.message = "";

    if (this.username === "" || this.password === "" || this.ime === "" || this.prezime === "" || this.telefon === "" || this.email === ""){
      this.error = "Morate unijeti sve obavezne podatke.";
      return;
    }

    const passwordRegex = /^(?=.{8,12}$)(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])[A-Za-z].*$/;

    if (!passwordRegex.test(this.password)) {
      this.error = "Lozinka mora imati 8-12 karaktera, početi slovom i sadržati veliko slovo, broj i specijalni karakter.";
      return;
    }

    if ( this.tip === "klijent_pravno" || this.tip === "stamparija") {
      if (this.nazivInstitucije === "" || this.adresaSedista === "" || this.maticniBroj === "" || this.pib === "") {
        this.error = "Morate unijeti sve podatke institucije.";
        return;
      }

      const maticniRegex = /^\d{8}$/;

      if (!maticniRegex.test(this.maticniBroj)) {
        this.error = "Matični broj mora imati tačno 8 cifara.";
        return;
      }

      const pibRegex = /^[1-9]\d{8}$/;

      if (!pibRegex.test(this.pib)) {
        this.error = "PIB mora imati 9 cifara i ne smije počinjati nulom.";
        return;
      }

      if (this.tip === "stamparija" && this.grad === "") {
        this.error = "Morate unijeti grad.";
        return;
      }
    }


    this.userService.register(this.username, this.password, this.ime, this.prezime, this.telefon, this.email, this.profilnaSlika, this.tip, this.nazivInstitucije, this.adresaSedista, this.maticniBroj, this.pib, this.grad).subscribe({ next: (response) => {
        this.message = response.message;
        this.error = "";

        setTimeout(() => {this.router.navigate([""]);}, 1500);
      }, error: (err) => {

        if (err.error?.message) {
          this.error = err.error.message;
        }
        else {
          this.error = "Greška prilikom registracije.";
        }
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if(input.files && input.files.length > 0) {
      this.profilnaSlika = input.files[0];
    }
  }
}
