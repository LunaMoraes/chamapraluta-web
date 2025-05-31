import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationStart } from '@angular/router'; // Import Router and NavigationStart
import { NgIf } from '@angular/common';
import { tsParticles } from "@tsparticles/engine";
import { NgParticlesService, NgxParticlesModule } from "@tsparticles/angular";
import { loadPolygonMaskPlugin } from "@tsparticles/plugin-polygon-mask";
import { loadFirePreset } from "@tsparticles/preset-fire";
import { AuthenticationService } from './authentication.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, NgxParticlesModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', '../styles.css'],
})
export class AppComponent implements OnInit {
  title = 'chamapraluta';
  isLoggedIn = false;
  isMenuOpen = false;
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private readonly particlesService: NgParticlesService
  ) {
    // On each navigation, refresh token if needed (exclude login page)
    this.router.events.pipe(
      filter(e => e instanceof NavigationStart)
    ).subscribe((e: NavigationStart) => {
      if (e.url !== '/login') {
        this.authService.refreshTokenIfNeeded();
      }
    });

    // Listen for login state changes
    this.authService.loginStateChanged.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
    });
  }
  id = "tsparticles";

  navigateToLogin(): void {
    this.router.navigate(['/login']); 
    this.isMenuOpen = false;
  }
  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']); 
    this.isMenuOpen = false;
  }
  navigateToCalendario(): void {
    this.router.navigate(['/calendario']); 
    this.isMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.isMenuOpen = false;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  async ngOnInit(): Promise<void> {
    // Check user session and set login state
    this.isLoggedIn = await this.authService.checkSession();
    // Initialize particles
    await this.particlesService.init(async () => {});
    await loadFirePreset(tsParticles);
    await tsParticles.load({
      id: this.id,
      options: {
        preset: 'fire',
        background: { color: '#000000' },
        fullScreen: { enable: true, zIndex: 1 }
      }
    });
  }
}
