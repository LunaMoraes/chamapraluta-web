import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({ providedIn: 'root' })
export class LoginRedirectGuard implements CanActivate {
  constructor(private auth: AuthenticationService, private router: Router) {}

  async canActivate(): Promise<boolean | UrlTree> {
    const logged = await this.auth.checkSession();
    if (logged) {
      // Already logged in, redirect to dashboard
      return this.router.parseUrl('/dashboard');
    }
    // Not logged in, allow access to login page
    return true;
  }
}
