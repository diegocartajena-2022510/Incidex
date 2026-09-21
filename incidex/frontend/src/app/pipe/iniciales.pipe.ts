import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iniciales',
  standalone: true,
})
export class InicialesPipe implements PipeTransform {
  transform(nombreCompleto: string | null | undefined): string {
    if (!nombreCompleto) return '?';

    const partes = nombreCompleto.trim().split(/\s+/);
    const primera = partes[0]?.charAt(0) ?? '';
    const segunda = partes.length > 1 ? partes[1].charAt(0) : '';

    return (primera + segunda).toUpperCase();
  }
}