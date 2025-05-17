import { Component, OnInit } from '@angular/core'; // Added OnInit
import { CommonModule } from '@angular/common';
// import * as XLSX from 'xlsx'; // Removed unused import
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit { // Implemented OnInit
  planilhaDados: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void { // Added ngOnInit
    this.carregarDados();
  }

  private carregarDados() {
    // Replace with your Google Spreadsheet CSV export URL
    const spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR33FIEH_t7Tzg7IKkT_ig0pBqVYsJzkplMuZRnP1Zkkx2wshRlhnHhcdwyqo1Zv2ADYrgs8Sz22io2/pub?output=csv'; 
    this.http.get(spreadsheetUrl, { responseType: 'text' })
      .subscribe(
        data => this.processarCSV(data),
        error => console.error('Erro ao carregar a planilha:', error)
      );
  }

  private processarCSV(csvData: string) {
    console.log('CSV Data:', csvData); // Log the raw CSV data for debugging
    const lines = csvData.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());

    this.planilhaDados = lines.slice(1)
      .filter(line => line.trim() !== '') // Filter out any empty lines
      .map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
          const rawValue = values[index];
          let processedValue: any = rawValue ? rawValue.trim() : '';

          // Converter string 'true'/'false' para boolean for 'importante' column
          if (header === 'importante') {
            processedValue = processedValue.toLowerCase() === 'true';
          }
          // Add other specific type conversions here if needed for other columns
          // else if (header === 'someNumberColumn') {
          //   processedValue = parseFloat(processedValue);
          // }

          obj[header] = processedValue;
          return obj;
        }, {} as any);
      });

      console.log('Processed Data:', this.planilhaDados); // Log the processed data for debugging
  }
}