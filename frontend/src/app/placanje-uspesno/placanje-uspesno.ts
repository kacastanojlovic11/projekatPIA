import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlacanjeService } from '../services/placanje-service';

@Component({
  selector: 'app-placanje-uspesno',
  imports: [],
  templateUrl: './placanje-uspesno.html',
  styleUrl: './placanje-uspesno.css',
})
export class PlacanjeUspesno implements OnInit{

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private placanjeService = inject(PlacanjeService);

  poruka: string = "Provjera plaćanja...";
  greska: string = "";

  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get("session_id");
    if (!sessionId) {
      this.poruka = "";
      this.greska = "Nedostaje Stripe session ID.";
      return;
    }

    this.placanjeService.provjeri(sessionId).subscribe({
      next: response => {
        this.poruka = response.message;
        localStorage.removeItem("narudzbineZaPlacanje");
      }, error: err => {
        this.poruka = "";
        if (err.error && err.error.message) {
          this.greska =  err.error.message;
        } else {
          this.greska = "Greška pri provjeri plaćanja.";
        }
      }
    });
  }

  profil() {
    this.router.navigate(["profil"]);
  }

}
