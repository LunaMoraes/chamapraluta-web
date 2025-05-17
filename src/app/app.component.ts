import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router'; // Import Router
import { NgIf } from '@angular/common';
import { tsParticles } from "@tsparticles/engine";
import { NgParticlesService, NgxParticlesModule } from "@tsparticles/angular";
import { loadPolygonMaskPlugin } from "@tsparticles/plugin-polygon-mask";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, NgxParticlesModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'chamapraluta';
  isLoggedIn = false;

  constructor(private router: Router, private readonly particlesService: NgParticlesService) {} // Inject Router
  id = "tsparticles";

  navigateToLogin(): void {
    this.router.navigate(['/login']); 
  }
  navigateToDashboard(): void {
    this.router.navigate(['/']); 
  }
  navigateToCalendario(): void {
    this.router.navigate(['/calendario']); 
  }

  async ngOnInit(): Promise<void> {
    await this.particlesService.init(async () => {});
    await loadPolygonMaskPlugin(tsParticles);
    
    await tsParticles.load({
      id: this.id,
      options: {
        preset: 'fire',
        background: {
          color: '#000000'
        }
      }
    });
  }
}
