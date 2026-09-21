export type Rol =
  | 'Administrador'
  | 'Profesor'
  | 'Personal TICS'
  | 'Personal Servicios'
  | 'Personal Infraestructura';

export type EstadoIncidencia = 'Pendiente' | 'En Revision' | 'En Proceso' | 'Resuelto' | 'Cerrado';

export interface Login {
  id_login: number;
  correo_login: string;
  usuario_login: string;
  contrasena_login: string;
  rol_login: Rol;
  estado_login: boolean;
}

export interface Departamento {
  id_departamento: number;
  nombre_departamento: string;
  descripcion?: string;
  estado_departamento: boolean;
}

export interface Usuario {
  id_usuario: number;
  id_login: number;
  id_departamento: number;
  nombre_usuario: string;
  apellido_usuario: string;
  telefono?: string;
  estado_usuario: boolean;
}

export interface Categoria {
  id_categoria: number;
  id_departamento: number;
  nombre_categoria: string;
  descripcion?: string;
  estado_categoria: boolean;
}

export interface Ubicacion {
  id_ubicacion: number;
  nombre_ubicacion: string;
  nivel?: string;
  descripcion?: string;
  estado_ubicacion: boolean;
}

export interface Prioridad {
  id_prioridad: number;
  nombre_prioridad: 'Baja' | 'Media' | 'Alta' | 'Critica';
  descripcion?: string;
  estado_prioridad: boolean;
}

export interface Incidencia {
  id_incidencia: number;
  id_usuario: number;
  id_categoria: number;
  id_ubicacion: number;
  id_prioridad: number;
  titulo_incidencia: string;
  descripcion_incidencia: string;
  estado_incidencia: EstadoIncidencia;
  fecha_creacion: string;
  fecha_resolucion?: string;
}

export interface Asignacion {
  id_asignacion: number;
  id_incidencia: number;
  id_usuario: number;
  fecha_asignacion: string;
  fecha_finalizacion?: string;
  observaciones?: string;
  estado_asignacion: boolean;
}

export interface HistorialIncidencia {
  id_historial: number;
  id_incidencia: number;
  id_usuario: number;
  estado_anterior?: string;
  estado_nuevo: string;
  comentario?: string;
  fecha_cambio: string;
}

export interface Comentario {
  id_comentario: number;
  id_incidencia: number;
  id_usuario: number;
  comentario: string;
  fecha_comentario: string;
}

export interface Adjunto {
  id_adjunto: number;
  id_incidencia: number;
  id_usuario: number;
  nombre_archivo: string;
  ruta_archivo: string;
  tipo_archivo?: string;
  fecha_archivo: string;
}
