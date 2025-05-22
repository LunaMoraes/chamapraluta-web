import { Component } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { NgIf, NgFor } from '@angular/common';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent {
  constructor(private dashboardService: DashboardService, private authService: AuthenticationService) {}
  pautaList: any[] = [];
  detailsPauta: any = [];
  showModal: boolean = false;

  ngOnInit(): void { // Added ngOnInit
    this.carregarPautas();
    console.log("isloggedIn: ", this.authService.isLoggedIn);
  }

  private carregarPautas() {
    this.pautaList = this.dashboardService.carregarPautas();
    console.log(this.pautaList); // Log the loaded data for debugging
  }

  private carregarDetalhesPauta(pautaId: number) {
    this.detailsPauta = this.dashboardService.carregarDetalhesPauta(pautaId);
    console.log(this.detailsPauta);
  }

  openModal(pautaId: number) {
    this.carregarDetalhesPauta(pautaId);
    this.showModal = true;
  }

  // Function to close the modal
  closeModal() {
    this.showModal = false;
    this.detailsPauta = null;
  }
}
