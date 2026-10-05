import { inject } from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

export const clientGuard: CanActivateFn = () => {
    
    const router = inject(Router);
    const sacuvani = localStorage.getItem("ulogovan");
    if (!sacuvani) return router.createUrlTree(["/"]);

    try {
        const korisnik = JSON.parse(sacuvani);
        if (korisnik.tip === "klijent_fizicko" || korisnik.tip === "klijent_pravno") {
            return true;
        }
    } catch {
    
    }
    return router.createUrlTree(["/"]);
  };

export const legalClientGuard: CanActivateFn = () => {
    
    const router = inject(Router);

    const sacuvani = localStorage.getItem("ulogovan");
    if (!sacuvani) {
        return router.createUrlTree(["/"]);
    }

    try {
        const korisnik = JSON.parse(sacuvani);
        if (korisnik.tip === "klijent_pravno") {
            return true;
        }
    } catch {
    }
    return router.createUrlTree(["/"]);
  };


export const printerGuard: CanActivateFn = () => {

    const router = inject(Router);

    const sacuvani = localStorage.getItem("ulogovan");

    if (!sacuvani) {
      return router.createUrlTree(["/"]);
    }

    try {

      const korisnik = JSON.parse(sacuvani);

      if (korisnik.tip === "stamparija") {
        return true;
      }

    } catch {
    }

    return router.createUrlTree(["/"]);
  };


export const adminGuard: CanActivateFn = () => {

    const router = inject(Router);

    const sacuvaniAdmin = localStorage.getItem("admin");

    if (!sacuvaniAdmin) {
      return router.createUrlTree(["/"]);
    }

    try {
        const admin = JSON.parse(sacuvaniAdmin);
        if (admin.tip === "admin") {
            return true;
        }
    } catch {
    }

    return router.createUrlTree(["/"]);
  };