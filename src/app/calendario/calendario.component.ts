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
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent {
  planilhaDados: any[] = [];

  private carregarDados() {

  }
  private processarCSV(csvData: string) {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    this.planilhaDados = lines.slice(1)
      .filter(line => line.trim() !== '')
      .map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index] ? values[index].trim() : '';
          
          // Converter string 'true'/'false' para boolean
          if (header === 'importante') {
            obj[header] = values[index] ? values[index].trim().toLowerCase() === 'true' : false;
          }
          
          return obj;
        }, {} as any);
      });
  }
}