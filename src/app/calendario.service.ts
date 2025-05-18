import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CalendarioService {

  constructor(private http: HttpClient) { }

  carregarDados() {
    const spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR33FIEH_t7Tzg7IKkT_ig0pBqVYsJzkplMuZRnP1Zkkx2wshRlhnHhcdwyqo1Zv2ADYrgs8Sz22io2/pub?gid=0&single=true&output=csv';
    return this.http.get(spreadsheetUrl, { responseType: 'text' })
      .pipe(
        map(csvData => {
          console.log('Raw CSV Data:', csvData); // Log the raw CSV data for debugging
          const lines = csvData.split('\n');
          const headers = lines[0].split(',').map(h => h.trim());

          let planilhaDados = lines.slice(1)
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

                obj[header] = processedValue;
                return obj;
              }, {} as any);
            });

          console.log('Processed Data:', planilhaDados); // Log the processed data for debugging
          return planilhaDados;
        })
      );
  }
}
