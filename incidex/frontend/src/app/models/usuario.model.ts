export type Rol =
  | 'Administrador'
  | 'Profesor'
  | 'Personal TICS'
  | 'Personal Servicios'
  | 'Personal Infraestructura';

export interface Usuario {
  id_usuario: number;
  id_login: number;
  id_departamento: number | null;
  nombre_usuario: string;
  apellido_usuario: string;
  telefono: string | null;
  estado_usuario: boolean;
  usuario_login: string;
  correo_login: string;
  rol_login: Rol;
  nombre_departamento: string | null;
}

export interface NuevoUsuario {
  correo: string;
  usuario: string;
  contrasena: string;
  rol: Rol;
  id_departamento: number | null;
  nombre: string;
  apellido: string;
  telefono: string | null;
}

export interface ActualizarUsuario {
  id_login: number;
  id_departamento: number | null;
  nombre_usuario: string;
  apellido_usuario: string;
  telefono: string | null;
  estado_usuario: boolean;
}

export interface PerfilBasico {
  id_usuario: number;
  nombre_usuario: string;
  apellido_usuario: string;
  id_departamento: number | null;
}

export interface UsuarioAutenticado {
  id_login: number;
  usuario_login: string;
  correo_login: string;
  rol_login: Rol;
  perfil: PerfilBasico | null;
}

export interface CredencialesLogin {
  usuario: string;
  contrasena: string;
}