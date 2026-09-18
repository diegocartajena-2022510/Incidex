import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { RespuestaApi } from '../../models/api-response.model';
import { Asignacion } from '../../models/seguimiento.model';

const API_URL = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class SeguimientoService {
  constructor(private http: HttpClient) {}

  listarAsignaciones(): Observable<Asignacion[]> {
    return this.http.get<RespuestaApi<Asignacion[]>>(`${API_URL}/asignaciones`).pipe(map((r) => r.data));
  }

  crearAsignacion(datos: { id_incidencia: number; id_usuario: number; observaciones?: string }): Observable<void> {
    return this.http
      .post<RespuestaApi<null>>(`${API_URL}/asignaciones`, datos)
      .pipe(map(() => undefined));
  }
}