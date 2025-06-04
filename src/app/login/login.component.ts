import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarioService } from '../calendario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loading = false;
  loginSubmitted: boolean = false;
  registerSubmitted: boolean = false;
  resetSubmitted: boolean = false;
  verifySubmitted: boolean = false;
  error= false;
  errorMessage = '';
  // Password reset fields and step control
  resetEmail: string = '';
  // Single verification code input (5 characters)
  codeInput: string = '';
  resetStep: number = 0;
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
    this.resetStep = 0;
    this.codeInput = '';
    this.error = false;
    this.errorMessage = '';
    if (type === 'login') {
      this.isLogin = 0;
      
    } else if (type === 'register') {
      this.isLogin = 1;
    } else if (type === 'reset') {
      this.isLogin = 2;
    }
  }
  
  // Initiate password reset by sending email
  async startPasswordReset() {
    this.resetSubmitted = true;
    if (!this.resetEmail) {
      this.error = true;
      this.errorMessage = 'Por favor informe seu e-mail.';
      return;
    }
    this.loading = true;
    this.error = false;
    try {
      const result = await this.authService.requestPasswordReset({ email: this.resetEmail });
      this.loading = false;
      if (result === 200) {
        this.resetStep = 1;
      } else {
        this.error = true;
        this.errorMessage = 'Não foi possível enviar o e-mail de redefinição.';
      }
    } catch (err) {
      this.loading = false;
      this.error = true;
      this.errorMessage = 'Erro ao enviar e-mail de redefinição.';
    }
  }
  
  // Verify reset code and complete reset
  async startVerifyPasswordReset() {
    this.verifySubmitted = true;
    if (this.codeInput.length < 5) {
      this.error = true;
      this.errorMessage = 'Por favor insira o código completo.';
      return;
    }
    this.loading = true;
    this.error = false;
    const code = this.codeInput;
    try {
      const result = await this.authService.verifyPasswordReset({ email: this.resetEmail, code });
      this.loading = false;
      if (result === 200) {
        // On successful verification, navigate to home via authService
      } else {
        this.error = true;
        this.errorMessage = 'Código inválido. Tente novamente.';
      }
    } catch (err) {
      this.loading = false;
      this.error = true;
      this.errorMessage = 'Erro ao verificar o código.';
    }
  }

  selectOrganizer(organizer: number){
    this.isOrganizerSelected = organizer
  }
  onSelectionChange() {
    this.isOtherSelected = this.selectedOption === 'Outro' ? 1 : 0;
  }
  
  // Phone mask methods
  onPhoneInput(event: any): void {
    const input = event.target;
    let value = input.value.replace(/\D/g, ''); // Remove non-digits
    
    // Apply phone mask
    if (value.length >= 11) {
      value = value.substring(0, 11); // Limit to 11 digits
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (value.length >= 7) {
      value = value.replace(/(\d{2})(\d{4,5})(\d{0,4})/, '($1) $2-$3');
    } else if (value.length >= 3) {
      value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    } else if (value.length >= 1) {
      value = value.replace(/(\d{0,2})/, '($1');
    }
    
    this.phone = value;
    input.value = value;
  }
  
  onPhoneKeydown(event: KeyboardEvent): void {
    // Allow: backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].indexOf(event.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (event.keyCode === 65 && event.ctrlKey === true) ||
        (event.keyCode === 67 && event.ctrlKey === true) ||
        (event.keyCode === 86 && event.ctrlKey === true) ||
        (event.keyCode === 88 && event.ctrlKey === true) ||
        // Allow: home, end, left, right
        (event.keyCode >= 35 && event.keyCode <= 39)) {
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
      event.preventDefault();
    }
  }
  
  async ngOnInit(): Promise<void> {
    this.authService.initGoogleAuth();
    try {
      this.orgsOptions = await this.calendarioService.retrieveOrgs();
    } catch (err) {
      console.error('Error loading organizations:', err);
      // Fallback to default options if API call fails
      this.orgsOptions = ['Outro', 'Independente'];
    }
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
    this.loginSubmitted = true;
    if (!this.username || !this.password) {
      this.error = true;
      this.errorMessage = 'Por favor preencha todos os campos de login.';
      return;
    }
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
    this.registerSubmitted = true;
    if (!this.nome || !this.registerEmail || !this.password) {
      this.error = true;
      this.errorMessage = 'Por favor preencha todos os campos de cadastro.';
      return;
    }
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
      if (result !== 201) {
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
