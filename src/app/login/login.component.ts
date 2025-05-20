import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loading = false;
  error= false;
  errorMessage = '';
  // Login form fields
  username: string = '';
  password: string = '';
  // Registration form fields
  nome: string = '';
  registerEmail: string = '';
  phone: string = '';
  outros: string = '';
  selectedOrganization: any;
  constructor(private authService: AuthenticationService) { }
  isLogin = 0;
  selectedOption: string = '';
  
  options: string[] = [
    'Psol',
    'PT',
    'Antiordem',
    'chama',
    'Antra',
    'IBRAT',
    'mães pela diversidade',
    'outro',
    'independente'
  ];

  changeLogin(type: string){
    if (type === 'login') {
      this.isLogin = 0;
    } else if (type === 'register') {
      this.isLogin = 1;
    } else if (type === 'reset') {
      this.isLogin = 2;
    }
  }
  isOrganizerSelected = 0;
  selectOrginzer(organizer: number){
    this.isOrganizerSelected = organizer
  }
  otherselected = 0


  selectOther(){

  }
  ngOnInit(): void {
    this.authService.initGoogleAuth();
  }
  

  // Add any additional logic you need here
  onSelectionChange() {
    console.log('Selected option:', this.selectedOption);
    // Add your custom logic here
  }

  signInAndAuthorize(): void {
    this.loading = true;
    this.error = false;
    try {
      this.authService.requestGoogleAccessToken();
    } catch (err) {
      console.error('Google sign-in error:', err);
      this.loading = false;
      // TODO: show user-friendly error message
    }
  }

  async startLogin() {
    let data = {
      username: this.username,
      password: this.password
    };
    this.loading = true;
    this.error = false;
    try {
      const result = await this.authService.loginUsuario(data);
      if (result !== 200) {
        this.loading = false;
        console.error('Login failed with code:', result);
        this.error = true;
        this.errorMessage = 'Login failed. Please check your credentials.';
      }
    } catch (err) {
      this.loading = false;
      console.error('Login error:', err);
      this.error = true;
      this.errorMessage = 'Login failed. Please check your credentials.';
    }
  }
  async startCadastro() {
    let data = {
      nome: this.nome,
      email: this.registerEmail,
      isOrganizer: this.isOrganizerSelected,
      phone: this.phone,
      organization: this.selectedOption,
      otherOrganization: this.outros
    };
    this.loading = true;
    this.error = false;
    try {
      const result = await this.authService.cadastrarUsuario(data);
      if (result !== 200) {
        this.loading = false;
        console.error('Registration failed with code:', result);
        this.error = true;
        this.errorMessage = 'Registration failed. Please check your details.'; 
      }
    } catch (err) {
      this.loading = false;
      console.error('Registration error:', err);
      this.error = true;
      this.errorMessage = 'Registration failed. Please check your details.';
    }
  }

}
