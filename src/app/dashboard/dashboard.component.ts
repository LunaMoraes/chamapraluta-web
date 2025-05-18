import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { NgIf, NgFor } from '@angular/common';
import { Modal } from 'bootstrap'; // Import Modal

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit, AfterViewInit { // Implement AfterViewInit
  @ViewChild('pautaModal') pautaModalElement: ElementRef | undefined;
  bootstrapModal: Modal | undefined;

  constructor(private dashboardService: DashboardService) {}
  pautaList: any[] = [];
  detailsPauta: any = {};

  ngOnInit(): void {
    this.carregarPautas();
  }

  ngAfterViewInit() { // Use ngAfterViewInit to ensure the modal element is available
    if (this.pautaModalElement) {
      this.bootstrapModal = new Modal(this.pautaModalElement.nativeElement);
    }
  }

  private carregarPautas() {
    this.pautaList = this.dashboardService.carregarPautas();
    console.log(this.pautaList); // Log the loaded data for debugging
  }

  openModal(pautaId: any) { //
    console.log('Opening modal for Pauta ID:', pautaId); // Log the Pauta ID for debugging
    this.detailsPauta = pautaId;
    if (this.bootstrapModal) {
      this.bootstrapModal.show();
    }
  }

  // Function to close the modal
  closeModal() {
    if (this.bootstrapModal) {
      this.bootstrapModal.hide();
    }
    this.detailsPauta = null; 
  }
}
