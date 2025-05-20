import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';

declare const google: any;
let tokenClient: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
selectedOrganization: any;
  constructor(private authService: AuthenticationService, private http: HttpClient) { }
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
    // Initialize any necessary data or services here
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: environment.googleClientId,
      scope: 'email profile openid',
      callback: (tokenResponse: any) => {
        if (tokenResponse.error) {
          console.error(tokenResponse.error);
          return;
        }
        console.log('Google token: ', tokenResponse.access_token);
        // Optionally send token to backend
        this.authService.authenticateWithGoogle(tokenResponse.access_token).subscribe(
          (res: any) => console.log('Backend auth response:', res),
          (err: any) => console.error('Backend auth error:', err)
        );
      },
    });
  }
  

  // Add any additional logic you need here
  onSelectionChange() {
    console.log('Selected option:', this.selectedOption);
    // Add your custom logic here
  }

  signInAndAuthorize(): void {
    if (!tokenClient) {
      console.error('Token client not initialized.');
      return;
    }
    tokenClient.requestAccessToken({ prompt: 'consent' });
  }

}
