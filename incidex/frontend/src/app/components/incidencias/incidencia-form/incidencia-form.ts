import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { IncidenciaService } from '../../../core/services/incidencia.service';
import { CatalogoService } from '../../../core/services/catalogo.service';
import { AuthService } from '../../../core/services/auth.service';
import { AdjuntoService } from '../../../core/services/adjunto.service';
import { Categoria, Prioridad, Ubicacion } from '../../../models/catalogo.model';
import { PrioridadLegiblePipe } from '../../../pipe/prioridad-legible.pipe';

const TAMANO_MAXIMO_MB = 10;
const TIPOS_PERMITIDOS = [
  'image/',
  'video/',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument',
];

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
  private adjuntoService = inject(AdjuntoService);
  private router = inject(Router);

  categorias = signal<Categoria[]>([]);
  ubicaciones = signal<Ubicacion[]>([]);
  prioridades = signal<Prioridad[]>([]);

  archivosSeleccionados = signal<File[]>([]);
  mensajeArchivo = signal('');

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

  onArchivosSeleccionados(evento: Event): void {
    this.mensajeArchivo.set('');
    const input = evento.target as HTMLInputElement;
    const nuevos = Array.from(input.files ?? []);

    const validos: File[] = [];
    for (const archivo of nuevos) {
      const esTipoPermitido = TIPOS_PERMITIDOS.some((tipo) => archivo.type.startsWith(tipo));
      const esTamanoValido = archivo.size <= TAMANO_MAXIMO_MB * 1024 * 1024;

      if (!esTipoPermitido) {
        this.mensajeArchivo.set(`"${archivo.name}" no es un tipo de archivo permitido.`);
        continue;
      }
      if (!esTamanoValido) {
        this.mensajeArchivo.set(`"${archivo.name}" supera el límite de ${TAMANO_MAXIMO_MB} MB.`);
        continue;
      }
      validos.push(archivo);
    }

    this.archivosSeleccionados.update((actuales) => [...actuales, ...validos]);
    input.value = '';
  }

  quitarArchivo(indice: number): void {
    this.archivosSeleccionados.update((actuales) => actuales.filter((_, i) => i !== indice));
  }

  formatearTamano(bytes: number): string {
    if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
        next: (incidencia) => this.subirAdjuntosYRedirigir(incidencia.id_incidencia, idUsuario),
        error: (err) => {
          this.enviando.set(false);
          this.mensajeError.set(err?.error?.mensaje || 'No se pudo registrar la incidencia.');
        },
      });
  }

  private subirAdjuntosYRedirigir(idIncidencia: number, idUsuario: number): void {
    const archivos = this.archivosSeleccionados();

    if (archivos.length === 0) {
      this.enviando.set(false);
      this.router.navigate(['/incidencias', idIncidencia]);
      return;
    }

    const subidas = archivos.map((archivo) => this.adjuntoService.subir(idIncidencia, idUsuario, archivo));

    forkJoin(subidas).subscribe({
      next: () => {
        this.enviando.set(false);
        this.router.navigate(['/incidencias', idIncidencia]);
      },
      error: () => {
        // La incidencia ya quedo registrada; solo algunos adjuntos pudieron fallar.
        this.enviando.set(false);
        this.router.navigate(['/incidencias', idIncidencia]);
      },
    });
  }
}
