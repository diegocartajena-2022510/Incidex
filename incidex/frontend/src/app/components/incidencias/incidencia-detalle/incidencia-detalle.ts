import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IncidenciaService } from '../../../core/services/incidencia.service';
import { ComentarioService } from '../../../core/services/comentario.service';
import { SeguimientoService } from '../../../core/services/seguimiento.service';
import { CatalogoService } from '../../../core/services/catalogo.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AuthService } from '../../../core/services/auth.service';
import { DetalleIncidencia, EstadoIncidencia } from '../../../models/incidencia.model';
import { Categoria } from '../../../models/catalogo.model';
import { Usuario } from '../../../models/usuario.model';
import { ClaseEstadoPipe } from '../../../pipe/clase-estado.pipe';
import { ClasePrioridadPipe } from '../../../pipe/clase-prioridad.pipe';
import { EstadoLegiblePipe } from '../../../pipe/estado-legible.pipe';
import { PrioridadLegiblePipe } from '../../../pipe/prioridad-legible.pipe';
import { FechaCortaPipe } from '../../../pipe/fecha-corta.pipe';
import { InicialesPipe } from '../../../pipe/iniciales.pipe';

const ORDEN_ESTADOS: EstadoIncidencia[] = ['Pendiente', 'En Revision', 'En Proceso', 'Resuelto', 'Cerrado'];

@Component({
  selector: 'app-incidencia-detalle',
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
    InicialesPipe,
  ],
  templateUrl: './incidencia-detalle.html',
  styleUrl: './incidencia-detalle.css',
})
export class IncidenciaDetalle implements OnInit {
  private ruta = inject(ActivatedRoute);
  private router = inject(Router);
  private incidenciaService = inject(IncidenciaService);
  private comentarioService = inject(ComentarioService);
  private seguimientoService = inject(SeguimientoService);
  private catalogoService = inject(CatalogoService);
  private usuarioService = inject(UsuarioService);
  authService = inject(AuthService);

  detalle = signal<DetalleIncidencia | null>(null);
  categorias = signal<Categoria[]>([]);
  usuarios = signal<Usuario[]>([]);

  cargando = signal(true);
  mensajeError = signal('');
  mensajeExito = signal('');

  nuevoComentario = '';
  enviandoComentario = signal(false);

  nuevoEstado: EstadoIncidencia | '' = '';
  comentarioEstado = '';
  actualizandoEstado = signal(false);

  usuarioAsignar: number | null = null;
  asignando = signal(false);

  idIncidencia = 0;

  ngOnInit(): void {
    this.idIncidencia = Number(this.ruta.snapshot.paramMap.get('id'));
    this.catalogoService.listarCategorias().subscribe({ next: (d) => this.categorias.set(d) });

    if (this.esAdministrador) {
      this.usuarioService.listar().subscribe({ next: (d) => this.usuarios.set(d) });
    }

    this.cargarDetalle();
  }

  cargarDetalle(): void {
    this.cargando.set(true);
    this.incidenciaService.obtenerPorId(this.idIncidencia).subscribe({
      next: (data) => {
        this.detalle.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.mensajeError.set('No se pudo cargar la incidencia.');
        this.cargando.set(false);
      },
    });
  }

  get idUsuarioActual(): number | null {
    return this.authService.usuarioActual()?.perfil?.id_usuario ?? null;
  }

  get esAdministrador(): boolean {
    return this.authService.usuarioActual()?.rol_login === 'Administrador';
  }

  get puedeGestionar(): boolean {
    const rol = this.authService.usuarioActual()?.rol_login;
    return rol === 'Administrador' || !!rol?.startsWith('Personal');
  }

  get siguientesEstados(): EstadoIncidencia[] {
    const actual = this.detalle()?.incidencia.estado_incidencia;
    if (!actual) return [];

    const indiceActual = ORDEN_ESTADOS.indexOf(actual);
    return ORDEN_ESTADOS.filter(
      (estado, indice) => indice > indiceActual && (this.esAdministrador || estado !== 'Cerrado')
    );
  }

  get nombreDepartamentoCategoria(): string {
    const inc = this.detalle()?.incidencia;
    if (!inc) return '—';
    return this.categorias().find((c) => c.id_categoria === inc.id_categoria)?.nombre_departamento || '—';
  }

  get usuariosDelDepartamento(): Usuario[] {
    const depto = this.nombreDepartamentoCategoria;
    return this.usuarios().filter((u) => u.nombre_departamento === depto);
  }

  get asignacionActiva() {
    const asignaciones = this.detalle()?.asignaciones ?? [];
    return asignaciones.find((a) => a.estado_asignacion) ?? null;
  }

  enviarComentario(): void {
    const texto = this.nuevoComentario.trim();
    const idUsuario = this.idUsuarioActual;

    if (!texto || !idUsuario) return;

    this.enviandoComentario.set(true);

    this.comentarioService
      .crear({ id_incidencia: this.idIncidencia, id_usuario: idUsuario, comentario: texto })
      .subscribe({
        next: () => {
          this.nuevoComentario = '';
          this.enviandoComentario.set(false);
          this.cargarDetalle();
        },
        error: () => {
          this.enviandoComentario.set(false);
          this.mensajeError.set('No se pudo enviar el comentario.');
        },
      });
  }

  actualizarEstado(): void {
    const data = this.detalle();
    if (!data || !this.nuevoEstado) return;

    this.actualizandoEstado.set(true);
    const inc = data.incidencia;

    this.incidenciaService
      .actualizar(this.idIncidencia, {
        id_usuario: inc.id_usuario,
        id_categoria: inc.id_categoria,
        id_ubicacion: inc.id_ubicacion,
        id_prioridad: inc.id_prioridad,
        titulo_incidencia: inc.titulo_incidencia,
        descripcion_incidencia: inc.descripcion_incidencia,
        estado_incidencia: this.nuevoEstado,
        comentario: this.comentarioEstado.trim() || undefined,
      })
      .subscribe({
        next: () => {
          this.actualizandoEstado.set(false);
          this.mensajeExito.set(`Estado actualizado a ${this.nuevoEstado}`);
          this.nuevoEstado = '';
          this.comentarioEstado = '';
          this.cargarDetalle();
        },
        error: () => {
          this.actualizandoEstado.set(false);
          this.mensajeError.set('No se pudo actualizar el estado.');
        },
      });
  }

  asignarResponsable(): void {
    if (!this.usuarioAsignar) return;

    this.asignando.set(true);

    this.seguimientoService
      .crearAsignacion({ id_incidencia: this.idIncidencia, id_usuario: this.usuarioAsignar })
      .subscribe({
        next: () => {
          this.asignando.set(false);
          this.mensajeExito.set('Asignación registrada correctamente');
          this.usuarioAsignar = null;
          this.cargarDetalle();
        },
        error: () => {
          this.asignando.set(false);
          this.mensajeError.set('No se pudo registrar la asignación.');
        },
      });
  }

  eliminarIncidencia(): void {
    if (!this.esAdministrador) return;
    if (!confirm('¿Eliminar esta incidencia de forma permanente?')) return;

    this.incidenciaService.eliminar(this.idIncidencia).subscribe({
      next: () => this.router.navigate(['/incidencias']),
      error: () => this.mensajeError.set('No se pudo eliminar la incidencia.'),
    });
  }
}
