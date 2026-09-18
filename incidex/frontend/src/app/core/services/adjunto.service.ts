import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { RespuestaApi } from '../../models/api-response.model';

const API_URL = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class AdjuntoService {
  constructor(private http: HttpClient) {}

  subir(idIncidencia: number, idUsuario: number, archivo: File): Observable<{ ruta_archivo: string }> {
    const formData = new FormData();
    formData.append('id_incidencia', String(idIncidencia));
    formData.append('id_usuario', String(idUsuario));
    formData.append('archivo', archivo);

    return this.http
      .post<RespuestaApi<{ ruta_archivo: string }>>(`${API_URL}/adjuntos`, formData)
      .pipe(map((r) => r.data));
  }
}
