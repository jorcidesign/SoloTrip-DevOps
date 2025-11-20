import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TripService } from '../../services/trip.service';
import { Trip } from '../../models/trip.interface';

@Component({
  selector: 'app-trip-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="form-container">
        <div class="form-header">
          <button class="btn-back" (click)="goBack()">← Volver</button>
          <h1>{{ isEditMode ? 'Editar' : 'Nuevo' }} Viaje</h1>
        </div>

        <form [formGroup]="tripForm" (ngSubmit)="onSubmit()" class="trip-form">
          
          <!-- Destination -->
          <div class="form-group">
            <label for="destination">Destino *</label>
            <input
              type="text"
              id="destination-input"
              formControlName="destination"
              class="form-control"
              placeholder="Ej: Barcelona, España"
            />
            <span class="error" *ngIf="tripForm.get('destination')?.touched && tripForm.get('destination')?.errors?.['required']">
              El destino es obligatorio
            </span>
          </div>

          <!-- Start Date -->
          <div class="form-group">
            <label for="startDate">Fecha de Inicio *</label>
            <input
              type="date"
              id="startdate-input"
              formControlName="startDate"
              class="form-control"
            />
            <span class="error" *ngIf="tripForm.get('startDate')?.touched && tripForm.get('startDate')?.errors?.['required']">
              La fecha es obligatoria
            </span>
          </div>

          <!-- Budget -->
          <div class="form-group">
            <label for="budget">Presupuesto (USD) *</label>
            <input
              type="number"
              id="budget-input"
              formControlName="budget"
              class="form-control"
              placeholder="Ej: 1500"
              min="0"
              step="100"
            />
            <span class="error" *ngIf="tripForm.get('budget')?.touched && tripForm.get('budget')?.errors?.['required']">
              El presupuesto es obligatorio
            </span>
          </div>

          <!-- Travel Style (COMBOBOX) -->
          <div class="form-group">
            <label for="travelStyle">Estilo de Viaje *</label>
            <select
              id="travelstyle-select"
              formControlName="travelStyle"
              class="form-control"
            >
              <option value="">Selecciona un estilo</option>
              <option value="BACKPACKER">🎒 Mochilero</option>
              <option value="STANDARD">✈️ Estándar</option>
              <option value="LUXURY">💎 Lujo</option>
            </select>
            <span class="error" *ngIf="tripForm.get('travelStyle')?.touched && tripForm.get('travelStyle')?.errors?.['required']">
              Selecciona un estilo de viaje
            </span>
          </div>

          <!-- Group Size (RADIO BUTTONS) -->
          <div class="form-group">
            <label>Tamaño del Grupo *</label>
            <div class="radio-group">
              <label class="radio-label">
                <input
                  type="radio"
                  id="groupsize-solo"
                  formControlName="groupSize"
                  value="Solo"
                  class="radio-input"
                />
                <span class="radio-custom"></span>
                <span>👤 Solo</span>
              </label>
              <label class="radio-label">
                <input
                  type="radio"
                  id="groupsize-couple"
                  formControlName="groupSize"
                  value="Pareja"
                  class="radio-input"
                />
                <span class="radio-custom"></span>
                <span>👥 Pareja</span>
              </label>
              <label class="radio-label">
                <input
                  type="radio"
                  id="groupsize-group"
                  formControlName="groupSize"
                  value="Grupo Pequeño"
                  class="radio-input"
                />
                <span class="radio-custom"></span>
                <span>👨‍👩‍👧‍👦 Grupo Pequeño</span>
              </label>
            </div>
            <span class="error" *ngIf="tripForm.get('groupSize')?.touched && tripForm.get('groupSize')?.errors?.['required']">
              Selecciona el tamaño del grupo
            </span>
          </div>

          <!-- Requires Visa (CHECKBOX) -->
          <div class="form-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                id="requiresvisa-checkbox"
                formControlName="requiresVisa"
                class="checkbox-input"
              />
              <span class="checkbox-custom"></span>
              <span>📋 Requiere Visa</span>
            </label>
          </div>

          <!-- Action Buttons -->
          <div class="form-actions">
            <button
              type="button"
              id="cancel-btn"
              class="btn btn-secondary"
              (click)="goBack()"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="save-trip-btn"
              class="btn btn-primary"
              [disabled]="!tripForm.valid || isLoading"
            >
              {{ isLoading ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Crear') }} Viaje
            </button>
          </div>

        </form>
      </div>
    </div>
  `,
  styles: [`
    .container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
    }

    .form-container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      animation: slideIn 0.5s ease;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .form-header {
      margin-bottom: 30px;
    }

    .form-header h1 {
      color: #333;
      font-size: 28px;
      margin: 20px 0 0 0;
    }

    .btn-back {
      background: transparent;
      border: none;
      color: #666;
      font-size: 14px;
      cursor: pointer;
      padding: 0;
      transition: color 0.3s;
    }

    .btn-back:hover {
      color: #0077CC;
    }

    .trip-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      margin-bottom: 8px;
      color: #333;
      font-weight: 500;
      font-size: 14px;
    }

    .form-control {
      padding: 12px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.3s;
    }

    .form-control:focus {
      outline: none;
      border-color: #0077CC;
      box-shadow: 0 0 0 3px rgba(0,119,204,0.1);
    }

    select.form-control {
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 12px center;
      background-size: 20px;
      padding-right: 40px;
    }

    .radio-group {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }

    .radio-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      position: relative;
      padding-left: 32px;
      user-select: none;
    }

    .radio-input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
    }

    .radio-custom {
      position: absolute;
      left: 0;
      height: 20px;
      width: 20px;
      border: 2px solid #e0e0e0;
      border-radius: 50%;
      transition: all 0.3s;
    }

    .radio-input:checked ~ .radio-custom {
      border-color: #0077CC;
      background: #0077CC;
    }

    .radio-custom:after {
      content: "";
      position: absolute;
      display: none;
      left: 6px;
      top: 6px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: white;
    }

    .radio-input:checked ~ .radio-custom:after {
      display: block;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      position: relative;
      padding-left: 32px;
      user-select: none;
    }

    .checkbox-input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
    }

    .checkbox-custom {
      position: absolute;
      left: 0;
      height: 22px;
      width: 22px;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      transition: all 0.3s;
    }

    .checkbox-input:checked ~ .checkbox-custom {
      background: #0077CC;
      border-color: #0077CC;
    }

    .checkbox-custom:after {
      content: "";
      position: absolute;
      display: none;
      left: 7px;
      top: 3px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }

    .checkbox-input:checked ~ .checkbox-custom:after {
      display: block;
    }

    .error {
      color: #f44336;
      font-size: 12px;
      margin-top: 4px;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
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

    .btn-primary:hover:not(:disabled) {
      background: #0066B8;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0,119,204,0.3);
    }

    .btn-secondary {
      background: #f0f0f0;
      color: #333;
    }

    .btn-secondary:hover {
      background: #e0e0e0;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class TripFormComponent implements OnInit {
  tripForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  tripId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private tripService: TripService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.tripForm = this.fb.group({
      destination: ['', Validators.required],
      startDate: ['', Validators.required],
      budget: ['', [Validators.required, Validators.min(0)]],
      travelStyle: ['', Validators.required],
      groupSize: ['Solo', Validators.required],
      requiresVisa: [false]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.tripId = +params['id'];
        this.loadTrip(this.tripId);
      }
    });
  }

  loadTrip(id: number): void {
    this.tripService.getTripById(id).subscribe({
      next: (trip) => {
        this.tripForm.patchValue({
          destination: trip.destination,
          startDate: trip.startDate,
          budget: trip.budget,
          travelStyle: trip.travelStyle,
          groupSize: trip.groupSize,
          requiresVisa: trip.requiresVisa
        });
      },
      error: (error) => {
        console.error('Error loading trip:', error);
        this.goBack();
      }
    });
  }

  onSubmit(): void {
    if (this.tripForm.valid) {
      this.isLoading = true;
      const tripData: Trip = this.tripForm.value;

      const request = this.isEditMode && this.tripId
        ? this.tripService.updateTrip(this.tripId, tripData)
        : this.tripService.createTrip(tripData);

      request.subscribe({
        next: () => {
          this.router.navigate(['/trips']);
        },
        error: (error) => {
          console.error('Error saving trip:', error);
          this.isLoading = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/trips']);
  }
}