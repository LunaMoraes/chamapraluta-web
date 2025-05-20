import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarioService } from '../calendario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
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
  isOrganizerSelected: number = 0;
  isOtherSelected: number = 0;
  constructor(private authService: AuthenticationService, private calendarioService: CalendarioService) { }
  isLogin = 0;
  selectedOption: string = '';

  orgsOptions: string[] = [];

  changeLogin(type: string){
    if (type === 'login') {
      this.isLogin = 0;
    } else if (type === 'register') {
      this.isLogin = 1;
    } else if (type === 'reset') {
      this.isLogin = 2;
    }
  }
  selectOrganizer(organizer: number){
    this.isOrganizerSelected = organizer
  }
  onSelectionChange() {
    this.isOtherSelected = this.selectedOption === 'Outro' ? 1 : 0;
  }

  ngOnInit(): void {
    this.authService.initGoogleAuth();
    this.orgsOptions = this.calendarioService.retrieveOrgs();
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
    if (this.isOtherSelected) {
      this.selectedOption = this.outros;
    }
    let data = {
      nome: this.nome,
      email: this.registerEmail,
      password: this.password,
      isOrganizer: this.isOrganizerSelected,
      phone: this.phone,
      organization: this.selectedOption,
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
