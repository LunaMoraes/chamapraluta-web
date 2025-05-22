import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({ providedIn: 'root' })
export class HomeRedirectGuard implements CanActivate {
  constructor(private auth: AuthenticationService, private router: Router) {}

  async canActivate(): Promise<boolean | UrlTree> {
    const logged = await this.auth.checkSession();
    if (logged) {
      // User is logged in, proceed to dashboard
      return true;
    } else {
      // Not logged in, redirect to login
      return this.router.parseUrl('/login');
    }
  }
}
