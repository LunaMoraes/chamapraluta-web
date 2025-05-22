import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';
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

  constructor(private http: HttpClient, private router: Router) {
    // Initialize from localStorage
    const logged = localStorage.getItem('isLoggedIn') === 'true';
    this.isLoggedIn = logged;
    if (logged) {
      this.userID = Number(localStorage.getItem('userId')) || 0;
      this.userPerms = Number(localStorage.getItem('userPerms')) || 0;
    }
  }

  async cadastrarUsuario(data: any): Promise<number> {
    const url = `${environment.apiUrl}/auth/register`;
    try {
      const resp = await firstValueFrom(
        this.http.post<{userId:number;userPerms:number}>(url, data, { observe: 'response' })
      );
      if (resp.status === 200 && resp.body) {
        this.sucessfulLogin(resp.body);
      }
      return resp.status;
    } catch (err: any) {
      return err.status || 500;
    }
  }

  async loginUsuario(data: any): Promise<number> {
    const url = `${environment.apiUrl}/auth/login`;
    try {
      const resp = await firstValueFrom(
        this.http.post<{userId:number;userPerms:number}>(url, data, { observe: 'response' })
      );
      if (resp.status === 200 && resp.body) {
        this.sucessfulLogin(resp.body);
      }
      return resp.status;
    } catch (err: any) {
      return err.status || 500;
    }
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
    const now = Date.now();
    // Store token timestamp for refresh
    localStorage.setItem('tokenTimestamp', now.toString());
    localStorage.setItem('userId', this.userID.toString());
    localStorage.setItem('userPerms', this.userPerms.toString());
    localStorage.setItem('isLoggedIn', 'true');
    this.router.navigate(['/dashboard']);
  }

  // Refresh access token if older than 30 minutes
  refreshTokenIfNeeded(): void {
    const ts = localStorage.getItem('tokenTimestamp');
    if (!ts) return;
    const timestamp = parseInt(ts, 10);
    const elapsed = Date.now() - timestamp;
    // 30 minutes in ms
    const halfHour = 30 * 60 * 1000;
    if (elapsed > halfHour) {
      const url = 'http://localhost:8000/api/auth/token/refresh/';
      this.http.post<{access_token: string}>(url, {})
        .subscribe(
          resp => {
            // update timestamp
            localStorage.setItem('tokenTimestamp', Date.now().toString());
          },
          err => {
            // on error, clear session and redirect to login
            this.clearSession();
            this.router.navigate(['/login']);
          }
        );
    }
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
    return this.http.post<{userId:number;userPerms:number}>(url, { access_token: accessToken });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Initiates password reset by sending reset email
  async requestPasswordReset(data: { email: string }): Promise<number> {
    const url = `${environment.apiUrl}/auth/password-reset`;
    try {
      const resp = await firstValueFrom(
        this.http.post(url, data, { observe: 'response' })
      );
      return resp.status;
    } catch (err: any) {
      return err.status || 500;
    }
  }
  
  // Verifies the password reset code
  async verifyPasswordReset(data: { email: string; code: string }): Promise<number> {
    const url = `${environment.apiUrl}/auth/password-reset/verify`;
    try {
      const resp = await firstValueFrom(
        this.http.post(url, data, { observe: 'response' })
      );
      return resp.status;
    } catch (err: any) {
      return err.status || 500;
    }
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
    const url = `${environment.apiUrl}/auth/session`;
    try {
      const user = await firstValueFrom(
        this.http.get<{userId:number;userPerms:number}>(url)
      );
      this.sucessfulLogin(user);
      return true;
    } catch (err) {
      this.clearSession();
      return false;
    }
  }
}
