import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then((m) => m.Login),
  },
  {
    path: '',
    loadComponent: () => import('./components/layout/shell').then((m) => m.Shell),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'incidencias',
        loadComponent: () =>
          import('./components/incidencias/incidencias-lista/incidencias-lista').then(
            (m) => m.IncidenciasLista
          ),
      },
      {
        path: 'incidencias/nueva',
        loadComponent: () =>
          import('./components/incidencias/incidencia-form/incidencia-form').then((m) => m.IncidenciaForm),
      },
      {
        path: 'incidencias/:id',
        loadComponent: () =>
          import('./components/incidencias/incidencia-detalle/incidencia-detalle').then(
            (m) => m.IncidenciaDetalle
          ),
      },
      {
        path: 'administracion',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./components/administracion/administracion').then((m) => m.Administracion),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
