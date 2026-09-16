import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { RespuestaApi } from '../../models/api-response.model';
import {ActualizarIncidencia,DetalleIncidencia,FiltrosIncidencia,Incidencia,IncidenciaCreada,NuevaIncidencia,} from '../../models/incidencia.model';

const API_URL = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class IncidenciaService {
  constructor(private http: HttpClient) {}

  listar(filtros?: FiltrosIncidencia): Observable<Incidencia[]> {
    let params = new HttpParams();

    if (filtros) {
      Object.entries(filtros).forEach(([clave, valor]) => {
        if (valor) params = params.set(clave, valor);
      });
    }

    return this.http
      .get<RespuestaApi<Incidencia[]>>(`${API_URL}/incidencias`, { params })
      .pipe(map((r) => r.data));
  }

  obtenerPorId(id: number): Observable<DetalleIncidencia> {
    return this.http
      .get<RespuestaApi<DetalleIncidencia>>(`${API_URL}/incidencias/${id}`)
      .pipe(map((r) => r.data));
  }

  crear(incidencia: NuevaIncidencia): Observable<IncidenciaCreada> {
    return this.http
      .post<RespuestaApi<IncidenciaCreada>>(`${API_URL}/incidencias`, incidencia)
      .pipe(map((r) => r.data));
  }

  actualizar(id: number, cambios: ActualizarIncidencia): Observable<void> {
    return this.http
      .put<RespuestaApi<null>>(`${API_URL}/incidencias/${id}`, cambios)
      .pipe(map(() => undefined));
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<RespuestaApi<null>>(`${API_URL}/incidencias/${id}`).pipe(map(() => undefined));
  }
}
