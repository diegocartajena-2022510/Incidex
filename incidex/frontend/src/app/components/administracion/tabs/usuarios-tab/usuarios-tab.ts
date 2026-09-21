import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { CatalogoService } from '../../../../core/services/catalogo.service';
import { Rol, Usuario } from '../../../../models/usuario.model';
import { Departamento } from '../../../../models/catalogo.model';

@Component({
  selector: 'app-usuarios-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios-tab.html',
  styleUrl: './usuarios-tab.css',
})
export class UsuariosTab implements OnInit {
  private usuarioService = inject(UsuarioService);
  private catalogoService = inject(CatalogoService);

  usuarios = signal<Usuario[]>([]);
  departamentos = signal<Departamento[]>([]);
  cargando = signal(true);
  guardando = signal(false);
  mensajeError = signal('');

  roles: Rol[] = ['Administrador', 'Profesor', 'Personal TICS', 'Personal Servicios', 'Personal Infraestructura'];

  nuevo = {
    correo: '',
    usuario: '',
    contrasena: '',
    rol: '' as Rol | '',
    id_departamento: null as number | null,
    nombre: '',
    apellido: '',
    telefono: '',
  };

  ngOnInit(): void {
    this.catalogoService.listarDepartamentos().subscribe({ next: (d) => this.departamentos.set(d) });
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.usuarioService.listar().subscribe({
      next: (d) => {
        this.usuarios.set(d);
        this.cargando.set(false);
      },
    });
  }

  get formularioValido(): boolean {
    const n = this.nuevo;
    return !!(n.correo.trim() && n.usuario.trim() && n.contrasena.trim() && n.rol && n.nombre.trim() && n.apellido.trim());
  }

  agregar(): void {
    if (!this.formularioValido) return;

    this.guardando.set(true);
    this.mensajeError.set('');

    this.usuarioService
      .crear({
        correo: this.nuevo.correo.trim(),
        usuario: this.nuevo.usuario.trim(),
        contrasena: this.nuevo.contrasena,
        rol: this.nuevo.rol as Rol,
        id_departamento: this.nuevo.id_departamento,
        nombre: this.nuevo.nombre.trim(),
        apellido: this.nuevo.apellido.trim(),
        telefono: this.nuevo.telefono.trim() || null,
      })
      .subscribe({
        next: () => {
          this.guardando.set(false);
          this.nuevo = {
            correo: '',
            usuario: '',
            contrasena: '',
            rol: '',
            id_departamento: null,
            nombre: '',
            apellido: '',
            telefono: '',
          };
          this.cargar();
        },
        error: (err) => {
          this.guardando.set(false);
          this.mensajeError.set(err?.error?.mensaje || 'No se pudo crear el usuario.');
        },
      });
  }

  toggleEstado(usuario: Usuario): void {
    this.usuarioService
      .actualizar(usuario.id_usuario, {
        id_login: usuario.id_login,
        id_departamento: usuario.id_departamento,
        nombre_usuario: usuario.nombre_usuario,
        apellido_usuario: usuario.apellido_usuario,
        telefono: usuario.telefono,
        estado_usuario: !usuario.estado_usuario,
      })
      .subscribe({ next: () => this.cargar() });
  }
}
