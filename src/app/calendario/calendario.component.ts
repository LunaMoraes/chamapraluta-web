/*import { Component } from '@angular/core';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css'
})
export class CalendarioComponent {

}*/

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule], // Importe CommonModule para usar *ngFor e *ngIf
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css'
})
export class CalendarioComponent {
  // Dados da planilha (simulados ou carregados)
  planilhaDados: any[] = [
    { data: '2023-01-01', evento: 'Ato na Assemblia Municipal', importante: true },
    { data: '2023-02-14', evento: 'Ato na univerdade x', importante: false },
    { data: '2023-12-25', evento: 'Ato na prefeitura', importante: true }
  ];

  // Ou para carregar de um arquivo Excel (opcional)
  carregarPlanilha(event: any) {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    
    fileReader.onload = (e) => {
      // Implemente a lógica de leitura do Excel aqui
      // Você precisaria instalar a biblioteca xlsx
      console.log('Arquivo carregado:', file.name);
    };
    
    fileReader.readAsArrayBuffer(file);
  }
}
