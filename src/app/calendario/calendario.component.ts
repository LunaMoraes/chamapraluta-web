import { Component, OnInit } from '@angular/core'; // Added OnInit
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Added FormsModule and ReactiveFormsModule
import { CalendarioService } from '../calendario.service';
import { AuthenticationService } from '../authentication.service';
import { timeout } from 'rxjs/operators';
import { TimeoutError } from 'rxjs';

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
  // Pagination properties
  itemsPerPage = 5;
  currentPage = 0;
  // Sorting properties
  sortColumn: string = '';
  sortDirection: number = 1;
  formSubmitted = false;
  loadingSubmit = false;
  errorSubmit = false;
  errorSubmitMessage = '';
  categorias = [
    "Luta Trabalhista",
    "Luta Campesina",
    "Luta Ambiental",
    "Movimento Estudantil",
    "Movimento Indigena",
    "Movimento LGBTQIAP+",
    "Movimento Feminista",
    "Movimento Preto",
    "Movimento Por Direitos PCD"
  ]

  constructor(private calendarioService: CalendarioService, private authService: AuthenticationService) {}

  ngOnInit(): void { // Added ngOnInit
    this.isLoggedIn = this.authService.isLoggedIn;
    this.userID = this.authService.getUserId();
    this.userPerms = this.authService.getUserPerms();
    this.carregarTabelaGeral();
    console.log("user id: ", this.userID);
  }

  private carregarTabelaGeral() {
    this.calendarioService.carregarDadosGerais().subscribe(dados => {
      this.planilhaDados = dados;
      this.loadingData = false;
      this.currentPage = 0;
    });
  }
  private carregarTabelaPropria() {
    this.planilhaPropria = this.calendarioService.carregarDadosProprios(this.userID);
    this.loadingData = false;
    this.currentPage = 0;
  }

  cadastrarAto(): void {
    this.formSubmitted = true;
    // Validate required fields
    const required = ['Nome','Estado','Cidade','Local','Data','Categoria','Descricao','Org'];
    for (const field of required) {
      if (!this.newAto[field]) {
        return;
      }
    }
    this.loadingSubmit = true;
    this.errorSubmit = false;
    this.calendarioService.cadastrarAto(this.newAto)
      .pipe(timeout(2000))
      .subscribe(
        (res: number) => {
          this.loadingSubmit = false;
          if (res === 200) {
            // success: reset form and go to table
            this.newAto = {};
            this.formSubmitted = false;
            this.changeView('minhaTabela');
          } else {
            this.errorSubmit = true;
            this.errorSubmitMessage = 'Insufficient permissions';
          }
        },
        err => {
          this.loadingSubmit = false;
          if (err instanceof TimeoutError) {
            this.errorSubmitMessage = 'Request timed out';
          } else {
            this.errorSubmitMessage = 'Insufficient permissions';
          }
          this.errorSubmit = true;
        }
      );
  }
  // Paged data getters
  get pagedDados(): any[] {
    const start = this.currentPage * this.itemsPerPage;
    return this.planilhaDados.slice(start, start + this.itemsPerPage);
  }
  get pagedPropria(): any[] {
    const start = this.currentPage * this.itemsPerPage;
    return this.planilhaPropria.slice(start, start + this.itemsPerPage);
  }
  // Total pages
  get totalPagesDados(): number {
    return Math.ceil(this.planilhaDados.length / this.itemsPerPage);
  }
  get totalPagesPropria(): number {
    return Math.ceil(this.planilhaPropria.length / this.itemsPerPage);
  }
  // Navigation
  prevPage(): void {
    if (this.currentPage > 0) this.currentPage--;
  }
  nextPage(): void {
    if (this.view === 'table' && this.currentPage < this.totalPagesDados - 1) this.currentPage++;
    if (this.view === 'minhaTabela' && this.currentPage < this.totalPagesPropria - 1) this.currentPage++;
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
    this.formSubmitted = true;
    // Handle form submission logic here
    console.log('Form submitted');
  }

  // Sort table by column
  sortBy(column: string): void {
    // Toggle direction if same column
    if (this.sortColumn === column) {
      this.sortDirection = -this.sortDirection;
    } else {
      this.sortColumn = column;
      this.sortDirection = 1;
    }
    // Choose array based on view
    const dataArray = this.view === 'table' ? this.planilhaDados : this.planilhaPropria;
    dataArray.sort((a, b) => {
      const aVal = a[column] ?? '';
      const bVal = b[column] ?? '';
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * this.sortDirection;
      }
      return ((aVal > bVal ? 1 : (aVal < bVal ? -1 : 0)) * this.sortDirection);
    });
    this.currentPage = 0;
  }
}