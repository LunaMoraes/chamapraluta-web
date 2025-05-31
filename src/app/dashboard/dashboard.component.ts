import { Component, OnInit } from '@angular/core';
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

export class DashboardComponent implements OnInit {
  constructor(private dashboardService: DashboardService, private authService: AuthenticationService) {}
  
  eventoDestaque: any = null;
  outrasManifestacoes: any[] = [];
  detailsPauta: any = [];
  showModal: boolean = false;

  ngOnInit(): void {
    this.carregarDados();
    console.log("isloggedIn: ", this.authService.isLoggedIn);
  }

  private carregarDados() {
    this.eventoDestaque = this.dashboardService.carregarEventoDestaque();
    this.outrasManifestacoes = this.dashboardService.carregarOutrasManifestacoes();
    console.log('Evento destaque:', this.eventoDestaque);
    console.log('Outras manifestações:', this.outrasManifestacoes);
  }

  private carregarDetalhesPauta(pautaId: number) {
    this.detailsPauta = this.dashboardService.carregarDetalhesPauta(pautaId);
    console.log(this.detailsPauta);
  }

  openModal(pautaId: number) {
    this.carregarDetalhesPauta(pautaId);
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.detailsPauta = null;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
