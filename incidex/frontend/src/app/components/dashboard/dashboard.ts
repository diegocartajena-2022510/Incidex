import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IncidenciaService } from '../../core/services/incidencia.service';
import { AuthService } from '../../core/services/auth.service';
import { Incidencia, EstadoIncidencia } from '../../models/incidencia.model';
import { ClaseEstadoPipe } from '../../pipe/clase-estado.pipe';
import { ClasePrioridadPipe } from '../../pipe/clase-prioridad.pipe';
import { EstadoLegiblePipe } from '../../pipe/estado-legible.pipe';
import { PrioridadLegiblePipe } from '../../pipe/prioridad-legible.pipe';
import { FechaCortaPipe } from '../../pipe/fecha-corta.pipe';

interface Estadistica {
  estado: EstadoIncidencia;
  etiqueta: string;
  total: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ClaseEstadoPipe,
    ClasePrioridadPipe,
    EstadoLegiblePipe,
    PrioridadLegiblePipe,
    FechaCortaPipe,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  incidencias = signal<Incidencia[]>([]);
  cargando = signal(true);
  mensajeError = signal('');

  private estadosOrdenados: { estado: EstadoIncidencia; etiqueta: string }[] = [
    { estado: 'Pendiente', etiqueta: 'Pendientes' },
    { estado: 'En Revision', etiqueta: 'En Revisión' },
    { estado: 'En Proceso', etiqueta: 'En Proceso' },
    { estado: 'Resuelto', etiqueta: 'Resueltas' },
    { estado: 'Cerrado', etiqueta: 'Cerradas' },
  ];

  constructor(
    private incidenciaService: IncidenciaService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.incidenciaService.listar().subscribe({
      next: (datos) => {
        this.incidencias.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudieron cargar las incidencias. Verifica que el backend este activo.');
        this.cargando.set(false);
      },
    });
  }

  get estadisticas(): Estadistica[] {
    const lista = this.incidencias();
    return this.estadosOrdenados.map(({ estado, etiqueta }) => ({
      estado,
      etiqueta,
      total: lista.filter((i) => i.estado_incidencia === estado).length,
    }));
  }

  get recientes(): Incidencia[] {
    return this.incidencias()
      .slice()
      .sort((a, b) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime())
      .slice(0, 6);
  }

  get nombreUsuario(): string {
    const perfil = this.authService.usuarioActual()?.perfil;
    return perfil?.nombre_usuario || '';
  }
}
