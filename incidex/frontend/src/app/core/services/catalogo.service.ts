import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { RespuestaApi } from '../../models/api-response.model';
import { Categoria, Departamento, Prioridad, Ubicacion } from '../../models/catalogo.model';

const API_URL = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  constructor(private http: HttpClient) {}

  listarDepartamentos(): Observable<Departamento[]> {
    return this.http
      .get<RespuestaApi<Departamento[]>>(`${API_URL}/departamentos`)
      .pipe(map((r) => r.data));
  }

  listarCategorias(): Observable<Categoria[]> {
    return this.http.get<RespuestaApi<Categoria[]>>(`${API_URL}/categorias`).pipe(map((r) => r.data));
  }

  listarUbicaciones(): Observable<Ubicacion[]> {
    return this.http.get<RespuestaApi<Ubicacion[]>>(`${API_URL}/ubicaciones`).pipe(map((r) => r.data));
  }

  listarPrioridades(): Observable<Prioridad[]> {
    return this.http.get<RespuestaApi<Prioridad[]>>(`${API_URL}/prioridades`).pipe(map((r) => r.data));
  }

  // Departamentos
  crearDepartamento(datos: { nombre_departamento: string; descripcion: string | null }): Observable<void> {
    return this.http
      .post<RespuestaApi<null>>(`${API_URL}/departamentos`, datos)
      .pipe(map(() => undefined));
  }

  actualizarDepartamento(
    id: number,
    datos: { nombre_departamento: string; descripcion: string | null; estado_departamento: boolean }
  ): Observable<void> {
    return this.http
      .put<RespuestaApi<null>>(`${API_URL}/departamentos/${id}`, datos)
      .pipe(map(() => undefined));
  }

  // Categorias
  crearCategoria(datos: { id_departamento: number; nombre_categoria: string; descripcion: string | null }): Observable<void> {
    return this.http.post<RespuestaApi<null>>(`${API_URL}/categorias`, datos).pipe(map(() => undefined));
  }

  actualizarCategoria(
    id: number,
    datos: { id_departamento: number; nombre_categoria: string; descripcion: string | null; estado_categoria: boolean }
  ): Observable<void> {
    return this.http
      .put<RespuestaApi<null>>(`${API_URL}/categorias/${id}`, datos)
      .pipe(map(() => undefined));
  }

  // Ubicaciones
  crearUbicacion(datos: { nombre_ubicacion: string; nivel: string | null; descripcion: string | null }): Observable<void> {
    return this.http.post<RespuestaApi<null>>(`${API_URL}/ubicaciones`, datos).pipe(map(() => undefined));
  }

  actualizarUbicacion(
    id: number,
    datos: { nombre_ubicacion: string; nivel: string | null; descripcion: string | null; estado_ubicacion: boolean }
  ): Observable<void> {
    return this.http
      .put<RespuestaApi<null>>(`${API_URL}/ubicaciones/${id}`, datos)
      .pipe(map(() => undefined));
  }

  // Prioridades
  actualizarPrioridad(
    id: number,
    datos: { nombre_prioridad: string; descripcion: string | null; estado_prioridad: boolean }
  ): Observable<void> {
    return this.http
      .put<RespuestaApi<null>>(`${API_URL}/prioridades/${id}`, datos)
      .pipe(map(() => undefined));
  }
}
