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

export const routes: Routes = [

    {path: '', component: Pocetna},
    {path: 'detalji/:sifra', component: ProizvodDetalji},

    {path: 'login', component: LoginComponent },
    {path: 'register', component: Register},
    {path: 'forgot-password', component:ForgotPassword},
    {path: 'reset-password/:token', component: ResetPassword},
    {path: 'admin-login', component: AdminLogin}, // admin / Admin123!
    

    {path: 'klijent', component: Klijent},
    {path: 'profil', component: Profil},
    {path: 'klijent/pretraga', component: Pocetna, data:{klijent: true}},
    {path: 'klijent/detalji/:sifra', component: ProizvodDetalji, data: { klijent: true}},

    {path: 'admin', component: Admin},

    {path: 'stamparija', component: Stamparija},
    
    
    
    
];
