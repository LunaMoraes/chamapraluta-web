import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router'; // Import Router
import { NgIf } from '@angular/common';
import { tsParticles } from "@tsparticles/engine";
import { NgParticlesService, NgxParticlesModule } from "@tsparticles/angular";
import { loadPolygonMaskPlugin } from "@tsparticles/plugin-polygon-mask";
import { loadFirePreset } from "@tsparticles/preset-fire";
import { AuthenticationService } from './authentication.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, NgxParticlesModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', '../styles.css'],
})
export class AppComponent {
  title = 'chamapraluta';
  isLoggedIn = false;
  isMenuOpen = false;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private readonly particlesService: NgParticlesService
  ) {} // Inject Router and AuthenticationService
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
