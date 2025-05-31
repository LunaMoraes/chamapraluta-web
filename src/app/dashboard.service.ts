import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor() { }

  carregarEventoDestaque() {
    // Featured event data
    return {
      id: 1,
      title: 'Manifestação para a luta pelo direito ao lorem ipsum dolor sit amet',
      description: 'Lorem ipsum sed ut consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      date: '2024-06-15',
      time: '14:00',
      location: 'Centro da Cidade',
      category: 'Movimento preto'
    };
  }

  carregarOutrasManifestacoes() {
    // Other demonstrations data
    return [
      {
        id: 2,
        title: 'Título da pauta',
        description: 'Lorem ipsum dolor consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
        date: '2024-06-20',
        time: '16:00',
        location: 'Praça Central'
      },
      {
        id: 3,
        title: 'Povo animado',
        description: 'Lorem ipsum dolor consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
        date: '2024-06-25',
        time: '18:00',
        location: 'Avenida Principal'
      }
    ];
  }

  carregarPautas() {
    // Legacy method - keeping for compatibility
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
