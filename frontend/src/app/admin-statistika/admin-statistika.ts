import { Component, inject, OnInit } from '@angular/core';
import { StatistikaService } from '../services/statistika-service';
import Chart from 'chart.js/auto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-statistika',
  imports: [FormsModule],
  templateUrl: './admin-statistika.html',
  styleUrl: './admin-statistika.css',
})
export class AdminStatistika implements OnInit {

  private statistikaService = inject(StatistikaService);

  grafikon: Chart | null = null;
  grafikonProizvodi: Chart | null = null;
  grafikonOcjene: Chart | null = null;

  podaciOcjena: any[] = [];

  prikazProizvoda: { [sifra: string]: boolean } = {};

  error: string = "";

  ngOnInit(): void {
    this.ucitajPromet();
    this.ucitajProizvode();
    this.ucitajOcjene();
  }

  ucitajPromet() {

    this.statistikaService.prometStamparija().subscribe({
      next: podaci => {
        const nazivi = podaci.map(p => p.nazivStamparije);
        const promet = podaci.map(p => p.promet);
        this.grafikon = new Chart('prometGrafikon',
          {
            type: 'bar',
            data: {
              labels: nazivi,
              datasets: [{
                label: 'Promet u posljednja 3 mjeseca (RSD)',
                data: promet
              }]
            },
            options: {
              responsive: true,
              scales: {
                y: { beginAtZero: true }
              }
            }
          });
      },
      error: err => {
        console.log(err);
        this.error = "Greška prilikom učitavanja statistike.";
      }
    });
  }

  ucitajProizvode() {
    this.statistikaService.najcesciProizvodi().subscribe({
      next: podaci => {
        const nazivi = podaci.map(p => p.naziv);
        const kolicine = podaci.map(p => p.kolicina);
        this.grafikonProizvodi = new Chart('proizvodiGrafikon',
          {
            type: 'pie',
            data: {
              labels: nazivi,
              datasets: [
                {
                  label: 'Broj naručenih primjeraka',
                  data: kolicine
                }
              ]
            },
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Udio naručenih proizvoda'
                },
                tooltip: {
                  callbacks: {
                    label: context => {
                      const vrijednost = Number(context.raw);
                      const ukupno = kolicine.reduce((zbir, x) => zbir + x, 0);
                      const procenat = ukupno > 0 ? (vrijednost / ukupno * 100).toFixed(1) : "0";
                      return (`${context.label}: ` + `${vrijednost} kom ` + `(${procenat}%)`);
                    }
                  }
                }
              }
            }
          }
        );
      },
      error: err => {
        console.log(err);
        this.error = "Greška prilikom učitavanja statistike proizvoda.";
      }
    });
  }

  ucitajOcjene() {
    this.statistikaService.ocjeneProizvoda().subscribe({
      next: podaci => {
        this.podaciOcjena = podaci;
        for (const proizvod of podaci) {
          this.prikazProizvoda[proizvod.sifra] = true;
        }
        this.napraviGrafikonOcjena();
      },
      error: err => {
        console.log(err);
        this.error = "Greška prilikom učitavanja ocjena proizvoda.";
      }
    });
  }

  napraviGrafikonOcjena() {

    if (this.grafikonOcjene) {
      this.grafikonOcjene.destroy();
    }

    const datasets = this.podaciOcjena.filter(proizvod => this.prikazProizvoda[proizvod.sifra]).map(
      proizvod => {
        return {
          label: proizvod.naziv,
          data: proizvod.tacke.map((t: any) => ({x: new Date(t.datum).getTime(), y: t.ocjena})),
          tension: 0.2
        };
      }
    );
    this.grafikonOcjene = new Chart('ocjeneGrafikon',
      {
        type: 'line',
        data: {datasets: datasets},
        options: {
          responsive: true,
          parsing: false,
          scales: {
            x: {
              type: 'linear',
              ticks: {
                callback: value => {
                  return new Date( Number(value)).toLocaleDateString();
                }
              }
            },
            y: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: 'Pozitivne ocjene (%)'
              }
            }
          }
        }
      }
    );
  }

  promijeniPrikaz() {
    this.napraviGrafikonOcjena();
  }
}
