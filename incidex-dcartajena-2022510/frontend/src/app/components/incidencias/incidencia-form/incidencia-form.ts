import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IncidenciaService } from '../../../core/services/incidencia.service';
import { CatalogoService } from '../../../core/services/catalogo.service';
import { AuthService } from '../../../core/services/auth.service';
import { Categoria, Prioridad, Ubicacion } from '../../../models/catalogo.model';
import { PrioridadLegiblePipe } from '../../../pipe/prioridad-legible.pipe';

@Component({
  selector: 'app-incidencia-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PrioridadLegiblePipe],
  templateUrl: './incidencia-form.html',
  styleUrl: './incidencia-form.css',
})
export class IncidenciaForm implements OnInit {
  private fb = inject(FormBuilder);
  private incidenciaService = inject(IncidenciaService);
  private catalogoService = inject(CatalogoService);
  private authService = inject(AuthService);
  private router = inject(Router);

  categorias = signal<Categoria[]>([]);
  ubicaciones = signal<Ubicacion[]>([]);
  prioridades = signal<Prioridad[]>([]);

  enviando = signal(false);
  mensajeError = signal('');

  formulario = this.fb.group({
    id_categoria: [null as number | null, [Validators.required]],
    id_ubicacion: [null as number | null, [Validators.required]],
    id_prioridad: [null as number | null, [Validators.required]],
    titulo_incidencia: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    descripcion_incidencia: ['', [Validators.required, Validators.minLength(10)]],
  });

  ngOnInit(): void {
    this.catalogoService.listarCategorias().subscribe({ next: (d) => this.categorias.set(d) });
    this.catalogoService.listarUbicaciones().subscribe({ next: (d) => this.ubicaciones.set(d) });
    this.catalogoService.listarPrioridades().subscribe({ next: (d) => this.prioridades.set(d) });
  }

  campoInvalido(nombre: string): boolean {
    const control = this.formulario.get(nombre);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onSubmit(): void {
    this.mensajeError.set('');

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const idUsuario = this.authService.usuarioActual()?.perfil?.id_usuario;
    if (!idUsuario) {
      this.mensajeError.set('No se pudo identificar tu usuario. Vuelve a iniciar sesión.');
      return;
    }

    this.enviando.set(true);

    const valores = this.formulario.value;

    this.incidenciaService
      .crear({
        id_usuario: idUsuario,
        id_categoria: valores.id_categoria!,
        id_ubicacion: valores.id_ubicacion!,
        id_prioridad: valores.id_prioridad!,
        titulo_incidencia: valores.titulo_incidencia!.trim(),
        descripcion_incidencia: valores.descripcion_incidencia!.trim(),
      })
      .subscribe({
        next: (incidencia) => {
          this.enviando.set(false);
          this.router.navigate(['/incidencias', incidencia.id_incidencia]);
        },
        error: (err) => {
          this.enviando.set(false);
          this.mensajeError.set(err?.error?.mensaje || 'No se pudo registrar la incidencia.');
        },
      });
  }
}
