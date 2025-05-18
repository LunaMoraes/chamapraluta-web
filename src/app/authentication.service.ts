import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  adminPerms = 0;
  isLoggedIn = true;
  userID = 1;
  constructor() { }

  cadastrarUsuario(usuario: any) {
    return 400;
  }
}
