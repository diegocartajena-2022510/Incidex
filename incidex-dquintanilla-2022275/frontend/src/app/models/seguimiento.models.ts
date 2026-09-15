export interface Asignacion {
  id_asignacion: number;
  id_incidencia: number;
  id_usuario: number;
  usuario?: string;
  titulo_incidencia?: string;
  fecha_asignacion: string;
  fecha_finalizacion: string | null;
  observaciones: string | null;
  estado_asignacion: boolean;
}

export interface HistorialIncidencia {
  id_historial: number;
  id_incidencia: number;
  titulo_incidencia?: string;
  id_usuario: number;
  usuario?: string;
  estado_anterior: string | null;
  estado_nuevo: string;
  comentario: string | null;
  fecha_cambio: string;
}

export interface Comentario {
  id_comentario: number;
  id_incidencia: number;
  titulo_incidencia?: string;
  id_usuario: number;
  usuario?: string;
  comentario: string;
  fecha_comentario: string;
}

export interface Adjunto {
  id_adjunto: number;
  id_incidencia: number;
  titulo_incidencia?: string;
  id_usuario: number;
  usuario?: string;
  nombre_archivo: string;
  ruta_archivo: string;
  tipo_archivo: string | null;
  fecha_archivo: string;
}
