import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogoService } from '../../../../core/services/catalogo.service';
import { Prioridad } from '../../../../models/catalogo.model';
import { PrioridadLegiblePipe } from '../../../../pipe/prioridad-legible.pipe';

@Component({
  selector: 'app-prioridades-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, PrioridadLegiblePipe],
  templateUrl: './prioridades-tab.html',
  styleUrl: './prioridades-tab.css',
})
export class PrioridadesTab implements OnInit {
  private catalogoService = inject(CatalogoService);

  prioridades = signal<Prioridad[]>([]);
  cargando = signal(true);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.catalogoService.listarPrioridades().subscribe({
      next: (d) => {
        this.prioridades.set(d);
        this.cargando.set(false);
      },
    });
  }

  toggleEstado(p: Prioridad): void {
    this.catalogoService
      .actualizarPrioridad(p.id_prioridad, {
        nombre_prioridad: p.nombre_prioridad,
        descripcion: p.descripcion,
        estado_prioridad: !p.estado_prioridad,
      })
      .subscribe({ next: () => this.cargar() });
  }
}
