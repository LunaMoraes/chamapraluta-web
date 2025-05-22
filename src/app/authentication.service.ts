import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, firstValueFrom } from 'rxjs';
import { environment } from '../environment/environment';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userPerms = 0;
  isLoggedIn = false;
  userID = 0;
  private tokenClient: any;

  constructor(private http: HttpClient, private router: Router) { }

  async cadastrarUsuario(data: any): Promise<number> {
    //mocked user data
    let res: { userId: number, userPerms: number } = {
      userId: 1,
      userPerms: 2
    };
    await this.delay(3000);
    this.sucessfulLogin(res);
    return 200;
  }
  async loginUsuario(data: any): Promise<number> {
    //mocked user data
    let res: { userId: number, userPerms: number } = {
      userId: 1,
      userPerms: 2
    };
    await this.delay(3000);
    //this.sucessfulLogin(res);
    return 400;
  }

  getUserId(){
    return this.userID;
  }
  getUserPerms(){
    return this.userPerms;
  }

  

  sucessfulLogin(res: any) {
    this.userID = res.userId;
    this.userPerms = res.userPerms;
    this.isLoggedIn = true;
    localStorage.setItem('userId', this.userID.toString());
    localStorage.setItem('userPerms', this.userPerms.toString());
    localStorage.setItem('isLoggedIn', 'true');
    this.router.navigate(['/dashboard']);
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
            this.sucessfulLogin(res);
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

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Initiates password reset by sending reset email
  async requestPasswordReset(data: { email: string }): Promise<number> {
    // Mock sending reset email
    await this.delay(2000);
    return 200;
  }
  
  // Verifies the password reset code
  async verifyPasswordReset(data: { email: string; code: string }): Promise<number> {
    // Mock code verification
    await this.delay(2000);
    return 200;
  }

  // Retrieve a cookie value by name
  private getCookie(name: string): string | null {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [key, value] = cookie.split('=');
      if (key === name) {
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  // Clears user session data
  private clearSession(): void {
    this.userID = 0;
    this.userPerms = 0;
    this.isLoggedIn = false;
    localStorage.removeItem('userId');
    localStorage.removeItem('userPerms');
    localStorage.removeItem('isLoggedIn');
  }

  // Checks for existing session token and initializes session
  async checkSession(): Promise<boolean> {
    const token = this.getCookie('sessionToken');
    if (false) {
      try {
        //const res = await firstValueFrom(this.http.get<{ userId: number; userPerms: number }>(
        //  `${environment.apiUrl}/auth/session`
        //)); 
        const res2 = { userId: 1, userPerms: 0 };
        this.userID = res2.userId;
        this.userPerms = res2.userPerms;
        this.isLoggedIn = true;
        localStorage.setItem('userId', res2.userId.toString());
        localStorage.setItem('userPerms', res2.userPerms.toString());
        localStorage.setItem('isLoggedIn', 'true');
        return true;
      } catch (error) {
        this.clearSession();
        return false;
      }
    } else {
      this.clearSession();
      return false;
    }
  }
}
