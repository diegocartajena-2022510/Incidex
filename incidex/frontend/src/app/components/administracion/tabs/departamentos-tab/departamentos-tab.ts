import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogoService } from '../../../../core/services/catalogo.service';
import { Departamento } from '../../../../models/catalogo.model';

@Component({
  selector: 'app-departamentos-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './departamentos-tab.html',
})
export class DepartamentosTab implements OnInit {
  private catalogoService = inject(CatalogoService);

  departamentos = signal<Departamento[]>([]);
  cargando = signal(true);
  guardando = signal(false);

  nuevoNombre = '';
  nuevaDescripcion = '';

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.catalogoService.listarDepartamentos().subscribe({
      next: (d) => {
        this.departamentos.set(d);
        this.cargando.set(false);
      },
    });
  }

  agregar(): void {
    if (!this.nuevoNombre.trim()) return;

    this.guardando.set(true);
    this.catalogoService
      .crearDepartamento({ nombre_departamento: this.nuevoNombre.trim(), descripcion: this.nuevaDescripcion.trim() || null })
      .subscribe({
        next: () => {
          this.guardando.set(false);
          this.nuevoNombre = '';
          this.nuevaDescripcion = '';
          this.cargar();
        },
        error: () => this.guardando.set(false),
      });
  }

  toggleEstado(dep: Departamento): void {
    this.catalogoService
      .actualizarDepartamento(dep.id_departamento, {
        nombre_departamento: dep.nombre_departamento,
        descripcion: dep.descripcion,
        estado_departamento: !dep.estado_departamento,
      })
      .subscribe({ next: () => this.cargar() });
  }
}
