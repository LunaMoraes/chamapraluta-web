import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environment/environment';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarioService {

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) { }

  carregarDadosGerais() {
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

  cadastrarAto(ato: any) {
    // Mock API call that returns status 200 after 1s delay
    return of(200).pipe(
      delay(1000)
    );
  }

  carregarDadosProprios(userID: any) {
    const dados = [
      { id: 1, Nome: 'manifestações 1', Data: '18-05-2025', Local: 'Local 1', Horario: '10:00', Categoria: 'Categoria 1', status: 'finalizada' },
      { id: 2, Nome: 'manifestações 2', Data: '19-05-2025', Local: 'Local 2', Horario: '11:00', Categoria: 'Categoria 2', status: 'pendente' },
      { id: 3, Nome: 'manifestações 3', Data: '20-05-2025', Local: 'Local 3', Horario: '12:00', Categoria: 'Categoria 3', status: 'ativa' }
    ]

    return dados;
  }  async retrieveOrgs(): Promise<string[]> {
    const url = `${environment.apiUrl}/info/organizations/list/`;

    const data = {
      
    };

    try {
      const response = await firstValueFrom(
        this.http.get<{nome: string}[]>(url, {
          params: data,
          observe: 'response'
        })
      );

      if (response.status === 200 && response.body) {
        // Extract the 'nome' property from each object and add "Outro" and "Independente"
        console.log('Organizations retrieved:', response.body);
        const orgsNames = response.body.map(org => org.nome);
        const orgsList = [...orgsNames, 'Outro', 'Independente'];
        return orgsList;
      }
      
      // If no data from server, return just the default options
      return ['Outro', 'Independente'];
    } catch (err: any) {
      // Check if token needs refresh
      if (err.status === 401) {
        this.authService.refreshTokenIfNeeded();
        throw new Error('Token expired, please try again');
      }
      console.error('Error retrieving organizations:', err);
      
      // Return default options on error
      return ['Outro', 'Independente'];
    }
  }
}
