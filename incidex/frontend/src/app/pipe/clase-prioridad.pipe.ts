import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clasePrioridad',
  standalone: true,
})
export class ClasePrioridadPipe implements PipeTransform {
  private clases: Record<string, string> = {
    Baja: 'prioridad-baja',
    Media: 'prioridad-media',
    Alta: 'prioridad-alta',
    Critica: 'prioridad-critica',
  };

  transform(prioridad: string | null | undefined): string {
    if (!prioridad) return '';
    return this.clases[prioridad] ?? '';
  }
}