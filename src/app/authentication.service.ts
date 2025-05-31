import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, firstValueFrom, Subject } from 'rxjs';
import { environment } from '../environment/environment';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userPerms = 0;
  isLoggedIn = false;
  userID = 0;
  refreshToken = '';
  accessToken = '';
  private tokenClient: any;
  
  // Subject to notify components when login state changes
  loginStateChanged = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router) {
    // Initialize from localStorage
    const logged = localStorage.getItem('isLoggedIn') === 'true';
    this.isLoggedIn = logged;
    if (logged) {
      this.userID = Number(localStorage.getItem('userId')) || 0;
      this.userPerms = Number(localStorage.getItem('userPerms')) || 0;
      this.accessToken = localStorage.getItem('accessToken') || '';
      this.refreshToken = localStorage.getItem('refreshToken') || '';
    }
  }

  async cadastrarUsuario(data: any): Promise<number> {
    const url = `${environment.apiUrl}/auth/register/`;
    try {
      const resp = await firstValueFrom(
        this.http.post<{userId:number;userPerms:number}>(url, data, { observe: 'response' })
      );
      if (resp.status === 201 && resp.body) {
        console.log('User registered successfully:', resp.body);
        this.sucessfulLogin(resp.body);
        return resp.status;
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
    console.log('Login successful:', res);
    this.userID = res.userId;
    this.userPerms = res.userPerms;
    this.isLoggedIn = true;
    this.accessToken = res.session_token;
    this.refreshToken = res.refresh_token;

    localStorage.setItem('accessToken', this.accessToken.toString());
    localStorage.setItem('refreshToken', this.refreshToken.toString());
    localStorage.setItem('userId', this.userID.toString());
    localStorage.setItem('userPerms', this.userPerms.toString());
    localStorage.setItem('isLoggedIn', 'true');
    
    // Emit login state change for app component to listen
    this.loginStateChanged.next(true);
    
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

  // Clears user session data (including token cookie)
  private clearSession(): void {
    this.userID = 0;
    this.userPerms = 0;
    this.isLoggedIn = false;
    localStorage.removeItem('userId');
    localStorage.removeItem('userPerms');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // Public logout method
  logout(): void {
    this.clearSession();
    this.loginStateChanged.next(false);
    this.router.navigate(['/login']);
  }
  // Checks for existing session via token & userID
  async checkSession(): Promise<boolean> {
    // 1. retrieve token and userID from localStorage
    const token = localStorage.getItem('accessToken');
    const storedId = localStorage.getItem('userId');
    if (!token || !storedId) {
      this.clearSession();
      return false;
    }
    // 2. validate with server by sending userId and sessionToken
    const url = `${environment.apiUrl}/auth/session/`;    try {
      const resp = await firstValueFrom(
        this.http.post<{userId:number;userPerms:number;newSessionToken?:string;newRefreshToken?:string}>(url,
          { userId: Number(storedId), sessionToken: token },
          { observe: 'response' }
        )
      );
        if (resp.status === 200 && resp.body) {
        // on success, reinitialize session
        this.userID = resp.body.userId;
        this.userPerms = resp.body.userPerms;
        this.isLoggedIn = true;
        
        if (resp.body.newSessionToken) {
          this.accessToken = resp.body.newSessionToken;
          localStorage.setItem('accessToken', this.accessToken);
        } else {
          this.accessToken = token;
        }
        
        if (resp.body.newRefreshToken) {
          this.refreshToken = resp.body.newRefreshToken;
          localStorage.setItem('refreshToken', this.refreshToken);
        } else {
          this.refreshToken = localStorage.getItem('refreshToken') || '';
        }
        
        return true;
      } else {
        // Invalid response, clear session
        this.clearSession();
        return false;
      }
    } catch (err: any) {
      if (err.status === 401 || err.status) {
        console.error('Unauthorized during session check:', err.status);
      }
      this.clearSession();
      return false;
    }
  }
}
