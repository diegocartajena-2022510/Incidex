import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { InicialesPipe } from '../../pipe/iniciales.pipe';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, InicialesPipe],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  menuAbierto = signal(false);

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

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
