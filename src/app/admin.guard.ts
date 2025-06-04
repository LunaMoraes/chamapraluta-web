import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthenticationService, private router: Router) {}
  async canActivate(): Promise<boolean | UrlTree> {
    const logged = await this.auth.checkSession();
    if (!logged) {
      // Not logged in, redirect to login
      return this.router.parseUrl('/login');
    }
    
    // Check if user has admin permissions (userPerms == 2)
    // Read directly from localStorage to ensure we have the latest value
    const userPermsFromStorage = localStorage.getItem('userPerms');
    const userPerms = userPermsFromStorage ? Number(userPermsFromStorage) : 0;
    
    if (userPerms !== 2) {
      // Not admin, redirect to dashboard
      console.log('AdminGuard: User does not have admin permissions. UserPerms:', userPerms);
      return this.router.parseUrl('/dashboard');
    }
    
    console.log('AdminGuard: User has admin permissions. UserPerms:', userPerms);
    // User is admin, allow access
    return true;
  }
}
