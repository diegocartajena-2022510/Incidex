import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { RespuestaApi } from '../../models/api-response.model';
import { ActualizarUsuario, NuevoUsuario, Usuario } from '../../models/usuario.model';

const API_URL = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  constructor(private http: HttpClient) {}

  listar(): Observable<Usuario[]> {
    return this.http.get<RespuestaApi<Usuario[]>>(`${API_URL}/usuarios`).pipe(map((r) => r.data));
  }

  crear(usuario: NuevoUsuario): Observable<void> {
    return this.http.post<RespuestaApi<null>>(`${API_URL}/usuarios`, usuario).pipe(map(() => undefined));
  }

  actualizar(id: number, cambios: ActualizarUsuario): Observable<void> {
    return this.http
      .put<RespuestaApi<null>>(`${API_URL}/usuarios/${id}`, cambios)
      .pipe(map(() => undefined));
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<RespuestaApi<null>>(`${API_URL}/usuarios/${id}`).pipe(map(() => undefined));
  }
}
