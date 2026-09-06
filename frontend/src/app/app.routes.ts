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

export const routes: Routes = [
    {path: 'login', component: LoginComponent },
    {path: 'register', component: Register},
    {path: 'klijent', component: Klijent},
    {path: 'stamparija', component: Stamparija},
    {path: 'forgot-password', component:ForgotPassword},
    {path: 'reset-password/:token', component: ResetPassword},
    {path: 'admin-login', component: AdminLogin},
    {path: 'admin', component: Admin},
    {path: '', component: Pocetna},
    {path: 'detalji/:sifra', component: ProizvodDetalji}
];
