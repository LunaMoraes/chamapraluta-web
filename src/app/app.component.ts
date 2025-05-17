import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router'; // Import Router
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'chamapraluta';
  isLoggedIn = false;

  constructor(private router: Router) {} // Inject Router

  navigateToLogin(): void {
    this.router.navigate(['/login']); 
  }
  navigateToDashboard(): void {
    this.router.navigate(['/']); 
  }
}
