import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router'; // Import Router
import { NgIf } from '@angular/common';
import { tsParticles } from "@tsparticles/engine";
import { NgParticlesService, NgxParticlesModule } from "@tsparticles/angular";
import { loadPolygonMaskPlugin } from "@tsparticles/plugin-polygon-mask";
import { loadFirePreset } from "@tsparticles/preset-fire";

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

  constructor(private router: Router, private readonly particlesService: NgParticlesService) {} // Inject Router
  id = "tsparticles";

  navigateToLogin(): void {
    this.router.navigate(['/login']); 
    this.isMenuOpen = false;
  }
  navigateToDashboard(): void {
    this.router.navigate(['/']); 
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
    await this.particlesService.init(async () => {});
    await loadFirePreset(tsParticles);
    
    await tsParticles.load({
      id: this.id,
      options: {
        preset: 'fire',
        background: {
          color: '#000000'
        },
        fullScreen: { // Ensure particles are in the background
          enable: true,
          zIndex: 1 /* Changed from 0 to -1 */
        }
      }
    });
  }
}
