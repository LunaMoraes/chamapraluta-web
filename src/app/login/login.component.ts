import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
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
    // Initialize any necessary data or services here
  }
  

  // Add any additional logic you need here
  onSelectionChange() {
    console.log('Selected option:', this.selectedOption);
    // Add your custom logic here
  }

}
