import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { Notificacion } from '../../models/notificacion.model';
import { InicialesPipe } from '../../pipe/iniciales.pipe';
import { FechaCortaPipe } from '../../pipe/fecha-corta.pipe';

const INTERVALO_REFRESCO_MS = 30000;

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, InicialesPipe, FechaCortaPipe],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell implements OnInit, OnDestroy {
  menuAbierto = signal(false);
  notificacionesAbiertas = signal(false);
  notificaciones = signal<Notificacion[]>([]);

  private intervalo?: ReturnType<typeof setInterval>;

  constructor(
    public authService: AuthService,
    private notificacionService: NotificacionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarNotificaciones();
    this.intervalo = setInterval(() => this.cargarNotificaciones(), INTERVALO_REFRESCO_MS);
  }

  ngOnDestroy(): void {
    if (this.intervalo) clearInterval(this.intervalo);
  }

  get usuario() {
    return this.authService.usuarioActual();
  }

  get nombreCompleto(): string {
    const perfil = this.usuario?.perfil;
    return perfil ? `${perfil.nombre_usuario} ${perfil.apellido_usuario}` : this.usuario?.usuario_login || '';
  }

  get puedeCrearIncidencia(): boolean {
    const rol = this.usuario?.rol_login;
    return rol === 'Profesor' || rol === 'Administrador';
  }

  get esAdministrador(): boolean {
    return this.usuario?.rol_login === 'Administrador';
  }

  get noLeidas(): number {
    return this.notificaciones().filter((n) => !n.leida).length;
  }

  cargarNotificaciones(): void {
    this.notificacionService.listar().subscribe({
      next: (datos) => this.notificaciones.set(datos),
      error: () => {},
    });
  }

  toggleNotificaciones(): void {
    this.notificacionesAbiertas.update((v) => !v);
  }

  cerrarNotificaciones(): void {
    this.notificacionesAbiertas.set(false);
  }

  abrirNotificacion(notificacion: Notificacion): void {
    if (!notificacion.leida) {
      this.notificacionService.marcarLeida(notificacion.id_notificacion).subscribe(() => this.cargarNotificaciones());
    }
    this.cerrarNotificaciones();
    if (notificacion.id_incidencia) {
      this.router.navigate(['/incidencias', notificacion.id_incidencia]);
    }
  }

  marcarTodasLeidas(): void {
    this.notificacionService.marcarTodasLeidas().subscribe(() => this.cargarNotificaciones());
  }

  cerrarMenu(): void {
    this.menuAbierto.set(false);
  }

  toggleMenu(): void {
    this.menuAbierto.update((v) => !v);
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
