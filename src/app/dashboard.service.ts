import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor() { }

  carregarPautas() {
    // Mock data for demonstration purposes
    return [
      { id: 1, title: 'Pauta 1', description: 'Descrição da Pauta 1' },
      { id: 2, title: 'Pauta 2', description: 'Descrição da Pauta 2' },
      { id: 3, title: 'Pauta 3', description: 'Descrição da Pauta 3' }
    ];
  }
  carregarDetalhesPauta(pautaId: number) {
    // Mock data for demonstration purposes
    const detalhes = { 
      id: 1, 
      title: 'Pauta 1', 
      details: 'Detalhes da Pauta 1',
      manifestacoes: [
        { id: 1, name: 'Manifestação 1', description: 'Descrição da Manifestação 1' },
        { id: 2, name: 'Manifestação 2', description: 'Descrição da Manifestação 2' }
      ]
    };

    return detalhes;
  }
}
