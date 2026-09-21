import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { RespuestaApi } from '../../models/api-response.model';
import { Notificacion } from '../../models/notificacion.model';

const API_URL = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class NotificacionService {
  constructor(private http: HttpClient) {}

  listar(): Observable<Notificacion[]> {
    return this.http
      .get<RespuestaApi<Notificacion[]>>(`${API_URL}/notificaciones`)
      .pipe(map((r) => r.data));
  }

  marcarLeida(id: number): Observable<void> {
    return this.http
      .put<RespuestaApi<null>>(`${API_URL}/notificaciones/${id}/leer`, {})
      .pipe(map(() => undefined));
  }

  marcarTodasLeidas(): Observable<void> {
    return this.http
      .put<RespuestaApi<null>>(`${API_URL}/notificaciones/leer-todas`, {})
      .pipe(map(() => undefined));
  }
}
