import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'claseEstado',
  standalone: true,
})
export class ClaseEstadoPipe implements PipeTransform {
  private clases: Record<string, string> = {
    Pendiente: 'estado-pendiente',
    'En Revision': 'estado-revision',
    'En Proceso': 'estado-proceso',
    Resuelto: 'estado-resuelto',
    Cerrado: 'estado-cerrado',
  };

  transform(estado: string | null | undefined): string {
    if (!estado) return '';
    return this.clases[estado] ?? '';
  }
}