import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { environment } from '../environment/environment';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userPerms = 2;
  isLoggedIn = true;
  userID = 1;
  private tokenClient: any;

  constructor(private http: HttpClient, private router: Router) { }

  cadastrarUsuario(usuario: any) {
    return 400;
  }

  getUserId(){
    return this.userID;
  }
  getUserPerms(){
    return this.userPerms;
  }

  // Initialize Google OAuth2 token client
  initGoogleAuth(): void {
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: environment.googleClientId,
      scope: 'email profile openid',
      callback: (tokenResponse: any) => {
        if (tokenResponse.error) {
          console.error('Google OAuth error:', tokenResponse.error);
          return;
        }
        console.log('Google token:', tokenResponse.access_token);
        // Send token to backend
        this.authenticateWithGoogle(tokenResponse.access_token).subscribe(
          res => {
            console.log('Backend auth response:', res);
            // Redirect to home on success
            this.router.navigate(['/']);
          },
          err => console.error('Backend auth error:', err)
        );
      },
    });
  }

  // Trigger the Google OAuth2 consent prompt
  requestGoogleAccessToken(): void {
    if (!this.tokenClient) {
      console.error('Token client not initialized.');
      return;
    }
    this.tokenClient.requestAccessToken({ prompt: 'consent' });
  }

  // Authenticate with Google OAuth2 token
  authenticateWithGoogle(accessToken: string): Observable<any> {
    const url = `${environment.apiUrl}/auth/google`;
    return of("Sucess"); //mocked temporary
    //return this.http.post(url, { access_token: accessToken });
  }
}
