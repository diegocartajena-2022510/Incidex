import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoLegible',
  standalone: true,
})
export class EstadoLegiblePipe implements PipeTransform {
  private etiquetas: Record<string, string> = {
    Pendiente: 'Pendiente',
    'En Revision': 'En Revisión',
    'En Proceso': 'En Proceso',
    Resuelto: 'Resuelto',
    Cerrado: 'Cerrado',
  };

  transform(estado: string | null | undefined): string {
    if (!estado) return '—';
    return this.etiquetas[estado] ?? estado;
  }
}
