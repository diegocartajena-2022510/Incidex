import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogoService } from '../../../../core/services/catalogo.service';
import { Ubicacion } from '../../../../models/catalogo.model';

@Component({
  selector: 'app-ubicaciones-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ubicaciones-tab.html',
  styleUrl: './ubicaciones-tab.css',
})
export class UbicacionesTab implements OnInit {
  private catalogoService = inject(CatalogoService);

  ubicaciones = signal<Ubicacion[]>([]);
  cargando = signal(true);
  guardando = signal(false);

  nuevoNombre = '';
  nuevoNivel = '';
  nuevaDescripcion = '';

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.catalogoService.listarUbicaciones().subscribe({
      next: (d) => {
        this.ubicaciones.set(d);
        this.cargando.set(false);
      },
    });
  }

  agregar(): void {
    if (!this.nuevoNombre.trim()) return;

    this.guardando.set(true);
    this.catalogoService
      .crearUbicacion({
        nombre_ubicacion: this.nuevoNombre.trim(),
        nivel: this.nuevoNivel.trim() || null,
        descripcion: this.nuevaDescripcion.trim() || null,
      })
      .subscribe({
        next: () => {
          this.guardando.set(false);
          this.nuevoNombre = '';
          this.nuevoNivel = '';
          this.nuevaDescripcion = '';
          this.cargar();
        },
        error: () => this.guardando.set(false),
      });
  }

  toggleEstado(ubi: Ubicacion): void {
    this.catalogoService
      .actualizarUbicacion(ubi.id_ubicacion, {
        nombre_ubicacion: ubi.nombre_ubicacion,
        nivel: ubi.nivel,
        descripcion: ubi.descripcion,
        estado_ubicacion: !ubi.estado_ubicacion,
      })
      .subscribe({ next: () => this.cargar() });
  }
}
