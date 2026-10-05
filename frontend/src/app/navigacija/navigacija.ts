import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navigacija',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navigacija.html',
  styleUrl: './navigacija.css',
})
export class Navigacija implements OnInit {

  private router = inject(Router);
  korisnik: any = null;
  admin: any = null;

  ngOnInit(): void {
    this.osvjezi();
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.osvjezi();
    });
  }


  osvjezi() {

    const sacuvaniKorisnik =
      localStorage.getItem("ulogovan");

    const sacuvaniAdmin =
      localStorage.getItem("admin");


    this.korisnik =
      sacuvaniKorisnik
        ? JSON.parse(sacuvaniKorisnik)
        : null;


    this.admin =
      sacuvaniAdmin
        ? JSON.parse(sacuvaniAdmin)
        : null;
  }


  izlogujSe() {

    localStorage.removeItem("ulogovan");

    localStorage.removeItem("admin");

    this.korisnik = null;

    this.admin = null;

    this.router.navigate(["/"]);
  }
}
