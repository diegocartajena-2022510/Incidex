import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prioridadLegible',
  standalone: true,
})
export class PrioridadLegiblePipe implements PipeTransform {
  transform(prioridad: string | null | undefined): string {
    if (!prioridad) return '—';
    return prioridad === 'Critica' ? 'Crítica' : prioridad;
  }
}
