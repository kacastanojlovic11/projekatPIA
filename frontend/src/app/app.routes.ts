import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { Register } from './register/register';
import { Klijent } from './klijent/klijent';
import { Stamparija } from './stamparija/stamparija';
import { ForgotPassword } from './forgot-password/forgot-password';
import { ResetPassword } from './reset-password/reset-password';
import { AdminLogin } from './admin-login/admin-login';
import { Admin } from './admin/admin';
import { Pocetna } from './pocetna/pocetna';
import { ProizvodDetalji } from './proizvod-detalji/proizvod-detalji';
import { Profil } from './profil/profil';
import { PripremaProizvoda } from './priprema-proizvoda/priprema-proizvoda';
import { Korpa } from './korpa/korpa';
import { ArhivaProizvoda } from './arhiva-proizvoda/arhiva-proizvoda';
import { PlacanjeUspesno } from './placanje-uspesno/placanje-uspesno';
import { PlacanjeOtkazano } from './placanje-otkazano/placanje-otkazano';
import { ProizvodiStamparije } from './proizvodi-stamparije/proizvodi-stamparije';
import { DodajProizvod } from './dodaj-proizvod/dodaj-proizvod';
import { DodajIzJson } from './dodaj-iz-json/dodaj-iz-json';
import { SlikeProizvoda } from './slike-proizvoda/slike-proizvoda';
import { NarudzbineStamparije } from './narudzbine-stamparije/narudzbine-stamparije';
import { JavneNabavke } from './javne-nabavke/javne-nabavke';
import { LicitacijeStamparije } from './licitacije-stamparije/licitacije-stamparije';
import { AdminKorisnici } from './admin-korisnici/admin-korisnici';
import { AdminIzmijeniKorisnika } from './admin-izmijeni-korisnika/admin-izmijeni-korisnika';
import { AdminKategorije } from './admin-kategorije/admin-kategorije';
import { AdminStatistika } from './admin-statistika/admin-statistika';
import { adminGuard, clientGuard, legalClientGuard, printerGuard } from './guards/auth.guards';

export const routes: Routes = [

    {path: '', component: Pocetna},
    {path: 'detalji/:sifra', component: ProizvodDetalji},

    {path: 'login', component: LoginComponent },
    {path: 'register', component: Register},
    {path: 'forgot-password', component:ForgotPassword},
    {path: 'reset-password/:token', component: ResetPassword},
    {path: 'admin-login', component: AdminLogin},

    {path: 'klijent', component: Klijent, canActivate: [clientGuard]},
    {path: 'klijent/profil', component: Profil, canActivate: [clientGuard]},
    {path: 'klijent/pretraga', component: Pocetna, data:{klijent: true}, canActivate: [clientGuard]},
    {path: 'klijent/detalji/:sifra', component: ProizvodDetalji, data: { klijent: true}, canActivate: [clientGuard]},
    {path: 'klijent/priprema/:sifra', component: PripremaProizvoda, canActivate: [clientGuard]},
    {path: 'klijent/korpa', component: Korpa, canActivate: [clientGuard]},
    {path: 'klijent/arhiva', component: ArhivaProizvoda, canActivate: [clientGuard]},
    {path: 'klijent/placanje-uspesno', component: PlacanjeUspesno, canActivate: [clientGuard]},
    {path: 'klijent/placanje-otkazano', component: PlacanjeOtkazano, canActivate: [clientGuard]},
    {path: 'klijent/javne-nabavke', component: JavneNabavke, canActivate: [legalClientGuard]},

    {path: 'admin', component: Admin, canActivate: [adminGuard]},
    {path: 'admin/korisnici', component:AdminKorisnici, canActivate: [adminGuard]},
    {path: 'admin/korisnik/:id', component:AdminIzmijeniKorisnika, canActivate: [adminGuard]},
    {path: 'admin/kategorije', component: AdminKategorije, canActivate: [adminGuard]},
    {path: 'admin/statistika', component: AdminStatistika, canActivate: [adminGuard]},

    {path: 'stamparija', component: Stamparija, canActivate: [printerGuard]},
    {path: 'stamparija/profil', component: Profil, canActivate: [printerGuard]},
    {path: 'stamparija/proizvodi', component: ProizvodiStamparije, canActivate: [printerGuard]},
    {path: 'stamparija/dodaj-proizvod', component: DodajProizvod, canActivate: [printerGuard]},
    {path: 'stamparija/dodaj-iz-json', component: DodajIzJson, canActivate: [printerGuard]},
    {path: 'stamparija/proizvod/:sifra/slike', component: SlikeProizvoda, canActivate: [printerGuard]},
    {path: 'stamparija/narudzbine', component: NarudzbineStamparije, canActivate: [printerGuard]},
    {path: 'stamparija/licitacije', component: LicitacijeStamparije, canActivate: [printerGuard]},

    {path: '**', redirectTo: ''}
];
