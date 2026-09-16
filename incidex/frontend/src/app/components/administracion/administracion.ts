import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosTab } from './tabs/usuarios-tab/usuarios-tab';
import { DepartamentosTab } from './tabs/departamentos-tab/departamentos-tab';
import { CategoriasTab } from './tabs/categorias-tab/categorias-tab';
import { UbicacionesTab } from './tabs/ubicaciones-tab/ubicaciones-tab';
import { PrioridadesTab } from './tabs/prioridades-tab/prioridades-tab';

type Pestana = 'usuarios' | 'departamentos' | 'categorias' | 'ubicaciones' | 'prioridades';

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [CommonModule, UsuariosTab, DepartamentosTab, CategoriasTab, UbicacionesTab, PrioridadesTab],
  templateUrl: './administracion.html',
  styleUrl: './administracion.css',
})
export class Administracion {
  pestanaActiva = signal<Pestana>('usuarios');

  pestanas: { clave: Pestana; etiqueta: string }[] = [
    { clave: 'usuarios', etiqueta: 'Usuarios' },
    { clave: 'departamentos', etiqueta: 'Departamentos' },
    { clave: 'categorias', etiqueta: 'Categorías' },
    { clave: 'ubicaciones', etiqueta: 'Ubicaciones' },
    { clave: 'prioridades', etiqueta: 'Prioridades' },
  ];

  cambiarPestana(clave: Pestana): void {
    this.pestanaActiva.set(clave);
  }
}
