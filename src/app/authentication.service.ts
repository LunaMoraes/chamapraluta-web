import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userPerms = 2;
  isLoggedIn = true;
  userID = 1;
  constructor() { }

  cadastrarUsuario(usuario: any) {
    return 400;
  }

  getUserId(){
    return this.userID;
  }
  getUserPerms(){
    return this.userPerms;
  }
}
