import { Component, OnInit } from '@angular/core'; // Added OnInit
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Added FormsModule and ReactiveFormsModule
import { CalendarioService } from '../calendario.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule], // Added FormsModule and ReactiveFormsModule
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit { 
  newAto: any = {}
  planilhaDados: any[] = [];
  planilhaPropria: any[] = [];
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
    this.carregarTabelaGeral();
  }

  private carregarTabelaGeral() {
    this.calendarioService.carregarDadosGerais().subscribe(dados => {
      this.planilhaDados = dados;
      this.loadingData = false;
    });
  }
  private carregarTabelaPropria() {
    this.planilhaPropria = this.calendarioService.carregarDadosProprios(this.userID)
    this.loadingData = false;
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
    this.loadingData = true;
    this.view = view;
    
    if (view === 'table') {
      this.carregarTabelaGeral();
    } else if (view === 'minhaTabela') {
      this.carregarTabelaPropria();
    } else if(view === 'cadastro'){
      this.loadingData = false;
    }
  }
  submitForm(){
    // Handle form submission logic here
    console.log('Form submitted');
  }
}