import { Component, OnInit } from '@angular/core'; // Added OnInit
import { CommonModule } from '@angular/common';
import { CalendarioService } from '../calendario.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit { // Implemented OnInit
  planilhaDados: any[] = [];
  selectedAto: any = null; // To store the selected event for the modal
  showModal: boolean = false; // To control modal visibility
  isLoggedIn = false;
  loadingData = true; 
  view: string = 'table';
  userID?: number;
  userPerms?: number;

  constructor(private calendarioService: CalendarioService, private authService: AuthenticationService) {}

  ngOnInit(): void { // Added ngOnInit
    this.isLoggedIn = this.authService.isLoggedIn;
    this.userID = this.authService.getUserId();
    this.userPerms = this.authService.getUserPerms();
    this.carregarDados();
  }

  private carregarDados() {
    this.calendarioService.carregarDados().subscribe(dados => {
      this.planilhaDados = dados;
      this.loadingData = false;
    });
  }

  // Function to open the modal and set the selected event
  openModal(ato: any) {
    this.selectedAto = ato;
    this.showModal = true;
  }

  // Function to close the modal
  closeModal() {
    this.showModal = false;
    this.selectedAto = null;
  }

  changeView(view: string) {
    this.view = view;
  }
}