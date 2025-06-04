import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { AdminService, PendingOrganizer } from '../admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  pendingOrganizers: PendingOrganizer[] = [];
  loading = false;
  error: string | null = null;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadPendingOrganizers();
  }

  async loadPendingOrganizers(): Promise<void> {
    this.loading = true;
    this.error = null;
    
    try {
      this.pendingOrganizers = await this.adminService.fetchOrganizerPending();
    } catch (err: any) {
      this.error = err.message || 'Erro ao carregar organizadores pendentes';
      console.error('Error loading pending organizers:', err);
    } finally {
      this.loading = false;
    }
  }

  async approveOrganizer(organizerId: number): Promise<void> {
    try {
      const success = await this.adminService.approveOrganizer(organizerId);
      if (success) {
        // Remove from pending list
        this.pendingOrganizers = this.pendingOrganizers.filter(org => org.id !== organizerId);
        console.log('Organizer approved successfully');
      }
    } catch (err: any) {
      this.error = err.message || 'Erro ao aprovar organizador';
      console.error('Error approving organizer:', err);
    }
  }

  async denyOrganizer(organizerId: number): Promise<void> {
    try {
      const success = await this.adminService.denyOrganizer(organizerId);
      if (success) {
        // Remove from pending list
        this.pendingOrganizers = this.pendingOrganizers.filter(org => org.id !== organizerId);
        console.log('Organizer denied successfully');
      }
    } catch (err: any) {
      this.error = err.message || 'Erro ao negar organizador';
      console.error('Error denying organizer:', err);
    }
  }
}
