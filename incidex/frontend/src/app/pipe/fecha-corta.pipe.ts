import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaCorta',
  standalone: true,
})
export class FechaCortaPipe implements PipeTransform {
  private meses = [
    'ene', 'feb', 'mar', 'abr', 'may', 'jun',
    'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
  ];

  transform(fecha: string | null | undefined, conHora = false): string {
    if (!fecha) return '—';

    const date = new Date(fecha);
    if (isNaN(date.getTime())) return '—';

    const dia = date.getDate();
    const mes = this.meses[date.getMonth()];
    const anio = date.getFullYear();

    if (!conHora) {
      return `${dia} ${mes} ${anio}`;
    }

    const horas = date.getHours().toString().padStart(2, '0');
    const minutos = date.getMinutes().toString().padStart(2, '0');

    return `${dia} ${mes} ${anio}, ${horas}:${minutos}`;
  }
}