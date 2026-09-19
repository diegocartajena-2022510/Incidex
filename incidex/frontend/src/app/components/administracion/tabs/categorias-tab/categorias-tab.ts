import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogoService } from '../../../../core/services/catalogo.service';
import { Categoria, Departamento } from '../../../../models/catalogo.model';

@Component({
  selector: 'app-categorias-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias-tab.html',
  styleUrl: './categorias-tab.css',
})
export class CategoriasTab implements OnInit {
  private catalogoService = inject(CatalogoService);

  categorias = signal<Categoria[]>([]);
  departamentos = signal<Departamento[]>([]);
  cargando = signal(true);
  guardando = signal(false);

  nuevoNombre = '';
  nuevaDescripcion = '';
  nuevoDepartamento: number | null = null;

  ngOnInit(): void {
    this.catalogoService.listarDepartamentos().subscribe({ next: (d) => this.departamentos.set(d) });
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.catalogoService.listarCategorias().subscribe({
      next: (d) => {
        this.categorias.set(d);
        this.cargando.set(false);
      },
    });
  }

  agregar(): void {
    if (!this.nuevoNombre.trim() || !this.nuevoDepartamento) return;

    this.guardando.set(true);
    this.catalogoService
      .crearCategoria({
        id_departamento: this.nuevoDepartamento,
        nombre_categoria: this.nuevoNombre.trim(),
        descripcion: this.nuevaDescripcion.trim() || null,
      })
      .subscribe({
        next: () => {
          this.guardando.set(false);
          this.nuevoNombre = '';
          this.nuevaDescripcion = '';
          this.nuevoDepartamento = null;
          this.cargar();
        },
        error: () => this.guardando.set(false),
      });
  }

  toggleEstado(cat: Categoria): void {
    this.catalogoService
      .actualizarCategoria(cat.id_categoria, {
        id_departamento: cat.id_departamento,
        nombre_categoria: cat.nombre_categoria,
        descripcion: cat.descripcion,
        estado_categoria: !cat.estado_categoria,
      })
      .subscribe({ next: () => this.cargar() });
  }
}
