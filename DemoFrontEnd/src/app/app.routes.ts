import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'trips',
    loadComponent: () => import('./components/trip-list/trip-list.component').then(m => m.TripListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'trips/new',
    loadComponent: () => import('./components/trip-form/trip-form.component').then(m => m.TripFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'trips/edit/:id',
    loadComponent: () => import('./components/trip-form/trip-form.component').then(m => m.TripFormComponent),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: '/trips',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];