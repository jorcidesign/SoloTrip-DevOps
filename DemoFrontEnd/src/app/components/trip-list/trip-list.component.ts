import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TripService } from '../../services/trip.service';
import { AuthService } from '../../services/auth.service';
import { Trip } from '../../models/trip.interface';

@Component({
  selector: 'app-trip-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <!-- Navbar -->
      <nav class="navbar">
        <div class="nav-brand">
          <span class="logo">🌍</span>
          <span>SoloTrip Connect</span>
        </div>
        <div class="nav-user">
          <span>Hola, {{ username }}!</span>
          <button id="logout-btn" class="btn-logout" (click)="logout()">
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="content">
        <div class="header-section">
          <h1>Mis Viajes</h1>
          <button id="new-trip-btn" class="btn btn-primary" (click)="goToNewTrip()">
            + Nuevo Viaje
          </button>
        </div>

        <!-- Search Bar -->
        <div class="search-section">
          <input
            type="text"
            id="search-input"
            [(ngModel)]="searchTerm"
            (keyup)="searchTrips()"
            placeholder="🔍 Buscar por destino..."
            class="search-input"
          />
        </div>

        <!-- Trips Table -->
        <div class="table-container" *ngIf="trips.length > 0">
          <table class="trips-table">
            <thead>
              <tr>
                <th>Destino</th>
                <th>Fecha de Inicio</th>
                <th>Presupuesto</th>
                <th>Estilo</th>
                <th>Tamaño Grupo</th>
                <th>¿Visa?</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let trip of filteredTrips">
                <td class="destination-cell">
                  <strong>{{ trip.destination }}</strong>
                </td>
                <td>{{ formatDate(trip.startDate) }}</td>
                <td>\${{ trip.budget | number:'1.2-2' }}</td>
                <td>
                  <span class="badge" [ngClass]="'badge-' + trip.travelStyle.toLowerCase()">
                    {{ trip.travelStyle }}
                  </span>
                </td>
                <td>{{ trip.groupSize }}</td>
                <td>
                  <span class="visa-indicator" [class.visa-required]="trip.requiresVisa">
                    {{ trip.requiresVisa ? '✓ Sí' : '✗ No' }}
                  </span>
                </td>
                <td class="actions-cell">
                  <button
                    [id]="'edit-btn-' + trip.id"
                    class="btn-action btn-edit"
                    (click)="editTrip(trip.id!)"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    [id]="'delete-btn-' + trip.id"
                    class="btn-action btn-delete"
                    (click)="deleteTrip(trip.id!)"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div *ngIf="trips.length === 0 && !isLoading" class="empty-state">
          <div class="empty-icon">✈️</div>
          <h3>No hay viajes registrados</h3>
          <p>¡Comienza a planificar tu próxima aventura!</p>
          <button class="btn btn-primary" (click)="goToNewTrip()">
            Crear mi primer viaje
          </button>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Cargando viajes...</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      min-height: 100vh;
      background: #f7f7f7;
    }

    .navbar {
      background: white;
      padding: 16px 24px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.08);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      font-size: 20px;
      font-weight: 600;
      color: #0077CC;
    }

    .logo {
      font-size: 28px;
      margin-right: 10px;
    }

    .nav-user {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .nav-user span {
      color: #333;
    }

    .btn-logout {
      padding: 8px 16px;
      background: transparent;
      border: 1px solid #ddd;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-logout:hover {
      background: #f0f0f0;
    }

    .content {
      padding: 32px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .header-section h1 {
      color: #333;
      font-size: 32px;
      margin: 0;
    }

    .search-section {
      margin-bottom: 24px;
    }

    .search-input {
      width: 100%;
      max-width: 400px;
      padding: 12px 20px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.3s;
    }

    .search-input:focus {
      outline: none;
      border-color: #0077CC;
      box-shadow: 0 0 0 3px rgba(0,119,204,0.1);
    }

    .table-container {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .trips-table {
      width: 100%;
      border-collapse: collapse;
    }

    .trips-table thead {
      background: #f9fafb;
    }

    .trips-table th {
      padding: 16px;
      text-align: left;
      font-weight: 600;
      color: #666;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .trips-table td {
      padding: 16px;
      border-top: 1px solid #f0f0f0;
    }

    .trips-table tbody tr:hover {
      background: #fafafa;
    }

    .destination-cell {
      color: #333;
    }

    .badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .badge-backpacker {
      background: #fff3e0;
      color: #e65100;
    }

    .badge-luxury {
      background: #f3e5f5;
      color: #6a1b9a;
    }

    .badge-standard {
      background: #e3f2fd;
      color: #0277bd;
    }

    .visa-indicator {
      font-weight: 500;
      color: #999;
    }

    .visa-indicator.visa-required {
      color: #4caf50;
    }

    .actions-cell {
      display: flex;
      gap: 8px;
    }

    .btn-action {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      font-size: 16px;
    }

    .btn-edit {
      background: #e3f2fd;
    }

    .btn-edit:hover {
      background: #bbdefb;
    }

    .btn-delete {
      background: #ffebee;
    }

    .btn-delete:hover {
      background: #ffcdd2;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary {
      background: #0077CC;
      color: white;
    }

    .btn-primary:hover {
      background: #0066B8;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0,119,204,0.3);
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .empty-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }

    .empty-state h3 {
      color: #333;
      margin-bottom: 10px;
    }

    .empty-state p {
      color: #666;
      margin-bottom: 24px;
    }

    .loading-state {
      text-align: center;
      padding: 60px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #0077CC;
      border-radius: 50%;
      margin: 0 auto 20px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class TripListComponent implements OnInit {
  trips: Trip[] = [];
  filteredTrips: Trip[] = [];
  searchTerm = '';
  username = '';
  isLoading = false;

  constructor(
    private tripService: TripService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername() || 'Usuario';
    this.loadTrips();
  }

  loadTrips(): void {
    this.isLoading = true;
    this.tripService.getAllTrips().subscribe({
      next: (trips) => {
        this.trips = trips;
        this.filteredTrips = trips;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading trips:', error);
        this.isLoading = false;
      }
    });
  }

  searchTrips(): void {
    if (!this.searchTerm.trim()) {
      this.filteredTrips = this.trips;
      return;
    }

    this.tripService.searchTrips(this.searchTerm).subscribe({
      next: (trips) => {
        this.filteredTrips = trips;
      },
      error: (error) => {
        console.error('Error searching trips:', error);
      }
    });
  }

  goToNewTrip(): void {
    this.router.navigate(['/trips/new']);
  }

  editTrip(id: number): void {
    this.router.navigate(['/trips/edit', id]);
  }

  deleteTrip(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este viaje?')) {
      this.tripService.deleteTrip(id).subscribe({
        next: () => {
          this.loadTrips();
        },
        error: (error) => {
          console.error('Error deleting trip:', error);
        }
      });
    }
  }

  formatDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(date).toLocaleDateString('es-ES', options);
  }

  logout(): void {
    this.authService.logout();
  }
}