import { Component, inject } from '@angular/core';
import { UserService } from '../services/user.service';
import User from '../models/user';

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  private userService = inject(UserService);

  korisnici: User[] = [];
  message: string = "";

  ngOnInit(){
    this.dohvatiKorisnike();
  }

  dohvatiKorisnike(){
    this.userService.getPendingUsers().subscribe(korisnici => {
      this.korisnici = korisnici;
    });
  }

  prihvati(username: string){
    this.userService.approveUser(username).subscribe(response => {
      this.message = response.message;
      this.dohvatiKorisnike();
    });
  }

  odbij(username: string){
    this.userService.rejectUser(username).subscribe(respone => {
      this.message = respone.message;
      this.dohvatiKorisnike();
    })
  }
}
