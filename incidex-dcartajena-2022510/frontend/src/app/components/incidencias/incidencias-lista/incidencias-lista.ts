import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IncidenciaService } from '../../../core/services/incidencia.service';
import { CatalogoService } from '../../../core/services/catalogo.service';
import { AuthService } from '../../../core/services/auth.service';
import { Incidencia } from '../../../models/incidencia.model';
import { Categoria, Prioridad, Ubicacion } from '../../../models/catalogo.model';
import { ClaseEstadoPipe } from '../../../pipe/clase-estado.pipe';
import { ClasePrioridadPipe } from '../../../pipe/clase-prioridad.pipe';
import { EstadoLegiblePipe } from '../../../pipe/estado-legible.pipe';
import { PrioridadLegiblePipe } from '../../../pipe/prioridad-legible.pipe';
import { FechaCortaPipe } from '../../../pipe/fecha-corta.pipe';

@Component({
  selector: 'app-incidencias-lista',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ClaseEstadoPipe,
    ClasePrioridadPipe,
    EstadoLegiblePipe,
    PrioridadLegiblePipe,
    FechaCortaPipe,
  ],
  templateUrl: './incidencias-lista.html',
  styleUrl: './incidencias-lista.css',
})
export class IncidenciasLista implements OnInit {
  incidencias = signal<Incidencia[]>([]);
  categorias = signal<Categoria[]>([]);
  ubicaciones = signal<Ubicacion[]>([]);
  prioridades = signal<Prioridad[]>([]);

  cargando = signal(true);
  mensajeError = signal('');

  busqueda = '';
  filtroEstado = '';
  filtroPrioridad = '';
  filtroCategoria = '';
  filtroUbicacion = '';

  estados = ['Pendiente', 'En Revision', 'En Proceso', 'Resuelto', 'Cerrado'];

  constructor(
    private incidenciaService: IncidenciaService,
    private catalogoService: CatalogoService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarIncidencias();

    this.catalogoService.listarCategorias().subscribe({ next: (d) => this.categorias.set(d) });
    this.catalogoService.listarUbicaciones().subscribe({ next: (d) => this.ubicaciones.set(d) });
    this.catalogoService.listarPrioridades().subscribe({ next: (d) => this.prioridades.set(d) });
  }

  cargarIncidencias(): void {
    this.cargando.set(true);
    this.incidenciaService
      .listar({
        estado: this.filtroEstado,
        prioridad: this.filtroPrioridad,
        categoria: this.filtroCategoria,
        ubicacion: this.filtroUbicacion,
      })
      .subscribe({
        next: (datos) => {
          this.incidencias.set(datos);
          this.cargando.set(false);
        },
        error: () => {
          this.mensajeError.set('No se pudieron cargar las incidencias.');
          this.cargando.set(false);
        },
      });
  }

  get incidenciasFiltradas(): Incidencia[] {
    const texto = this.busqueda.trim().toLowerCase();
    if (!texto) return this.incidencias();

    return this.incidencias().filter((i) => i.titulo_incidencia.toLowerCase().includes(texto));
  }

  get puedeCrear(): boolean {
    const rol = this.authService.usuarioActual()?.rol_login;
    return rol === 'Profesor' || rol === 'Administrador';
  }

  irADetalle(id: number): void {
    this.router.navigate(['/incidencias', id]);
  }
}
