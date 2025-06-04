import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environment/environment';
import { AuthenticationService } from './authentication.service';

export interface PendingOrganizer {
  id: number;
  nome: string;
  phone: string;
  email: string;
  organizacao: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private http: HttpClient, 
    private authService: AuthenticationService
  ) { }  async fetchOrganizerPending(): Promise<PendingOrganizer[]> {
    const url = `${environment.apiUrl}/admin/organizers/pending/`;
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    
    if (!accessToken || !userId) {
      throw new Error('No access token or user ID found');
    }

    const data = {
      accessToken: accessToken,
      userId: Number(userId)
    };

    try {
      const response = await firstValueFrom(
        this.http.get<PendingOrganizer[]>(url, {
          params: data,
          observe: 'response'
        })
      );

      if (response.status === 200 && response.body) {
        return response.body;
      }
      return [];
    } catch (err: any) {
      // Check if token needs refresh
      if (err.status === 401) {
        this.authService.refreshTokenIfNeeded();
        throw new Error('Token expired, please try again');
      }
      console.error('Error fetching pending organizers:', err);
      throw err;
    }
  }
  async approveOrganizer(organizerId: number): Promise<boolean> {
    const url = `${environment.apiUrl}/admin/organizers/approve/`;
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    
    if (!accessToken || !userId) {
      throw new Error('No access token or user ID found');
    }

    const data = {
      accessToken: accessToken,
      userId: Number(userId),
      organizerId: organizerId
    };

    try {
      const response = await firstValueFrom(
        this.http.post(url, 
          data,
          { observe: 'response' }
        )
      );

      return response.status === 200;
    } catch (err: any) {
      // Check if token needs refresh
      if (err.status === 401) {
        this.authService.refreshTokenIfNeeded();
        throw new Error('Token expired, please try again');
      }
      console.error('Error approving organizer:', err);
      throw err;
    }
  }
  async denyOrganizer(organizerId: number): Promise<boolean> {
    const url = `${environment.apiUrl}/admin/organizers/deny/`;
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    
    if (!accessToken || !userId) {
      throw new Error('No access token or user ID found');
    }

    const data = {
      accessToken: accessToken,
      userId: Number(userId),
      organizerId: organizerId
    };

    try {
      const response = await firstValueFrom(
        this.http.post(url, 
          data,
          { observe: 'response' }
        )
      );

      return response.status === 200;
    } catch (err: any) {
      // Check if token needs refresh
      if (err.status === 401) {
        this.authService.refreshTokenIfNeeded();
        throw new Error('Token expired, please try again');
      }
      console.error('Error denying organizer:', err);
      throw err;
    }
  }
}
