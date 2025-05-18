import { Component, OnInit } from '@angular/core'; // Added OnInit
import { CommonModule } from '@angular/common';
// import * as XLSX from 'xlsx'; // Removed unused import
import { HttpClient } from '@angular/common/http';
import { CalendarioService } from '../calendario.service';

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

  constructor(private http: HttpClient, private calendarioService: CalendarioService) {}

  ngOnInit(): void { // Added ngOnInit
    this.carregarDados();
  }

  private carregarDados() {
    this.calendarioService.carregarDados().subscribe(dados => {
      this.planilhaDados = dados;
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
}