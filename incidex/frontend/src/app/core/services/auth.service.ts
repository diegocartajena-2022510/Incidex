import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { RespuestaApi } from '../../models/api-response.model';
import { CredencialesLogin, UsuarioAutenticado } from '../../models/usuario.model';

const CLAVE_TOKEN = 'incidex_token';
const CLAVE_USUARIO = 'incidex_usuario';
const API_URL = 'http://localhost:3000/api';

interface RespuestaLogin {
  token: string;
  usuario: UsuarioAutenticado;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usuarioSignal = signal<UsuarioAutenticado | null>(this.leerUsuarioGuardado());

  usuarioActual = computed(() => this.usuarioSignal());
  estaAutenticado = computed(() => !!this.usuarioSignal());

  constructor(private http: HttpClient) {}

  login(credenciales: CredencialesLogin): Observable<RespuestaApi<RespuestaLogin>> {
    return this.http.post<RespuestaApi<RespuestaLogin>>(`${API_URL}/auth/login`, credenciales).pipe(
      tap((respuesta) => {
        localStorage.setItem(CLAVE_TOKEN, respuesta.data.token);
        localStorage.setItem(CLAVE_USUARIO, JSON.stringify(respuesta.data.usuario));
        this.usuarioSignal.set(respuesta.data.usuario);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_USUARIO);
    this.usuarioSignal.set(null);
  }

  obtenerToken(): string | null {
    return localStorage.getItem(CLAVE_TOKEN);
  }

  private leerUsuarioGuardado(): UsuarioAutenticado | null {
    const guardado = localStorage.getItem(CLAVE_USUARIO);
    return guardado ? JSON.parse(guardado) : null;
  }
}
