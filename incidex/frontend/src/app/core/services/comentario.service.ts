import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { RespuestaApi } from '../../models/api-response.model';

const API_URL = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class ComentarioService {
  constructor(private http: HttpClient) {}

  crear(comentario: { id_incidencia: number; id_usuario: number; comentario: string }): Observable<void> {
    return this.http
      .post<RespuestaApi<null>>(`${API_URL}/comentarios`, comentario)
      .pipe(map(() => undefined));
  }
}