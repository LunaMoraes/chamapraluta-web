import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userPerms = 2;
  isLoggedIn = true;
  userID = 1;
  constructor(private http: HttpClient) { }

  cadastrarUsuario(usuario: any) {
    return 400;
  }

  getUserId(){
    return this.userID;
  }
  getUserPerms(){
    return this.userPerms;
  }

  // Authenticate with Google OAuth2 token
  authenticateWithGoogle(accessToken: string): Observable<any> {
    const url = `${environment.apiUrl}/auth/google`;
    return this.http.post(url, { access_token: accessToken });
  }
}
