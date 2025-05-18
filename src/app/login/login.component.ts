import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private authService: AuthenticationService) { }
  isLogin = 0;

  changeLogin(type: string){
    if (type === 'login') {
      this.isLogin = 0;
    } else if (type === 'register') {
      this.isLogin = 1;
    } else if (type === 'reset') {
      this.isLogin = 2;
    }
  }
  ngOnInit(): void {
    // Initialize any necessary data or services here
    
  }

}
