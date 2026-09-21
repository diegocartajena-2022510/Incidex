export type EstadoIncidencia = 'Pendiente' | 'En Revision' | 'En Proceso' | 'Resuelto' | 'Cerrado';

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
  fecha_resolucion: string | null;
  usuario?: string;
  nombre_categoria?: string;
  nombre_ubicacion?: string;
  nombre_prioridad?: string;
}

export interface NuevaIncidencia {
  id_usuario: number;
  id_categoria: number;
  id_ubicacion: number;
  id_prioridad: number;
  titulo_incidencia: string;
  descripcion_incidencia: string;
}

export interface ActualizarIncidencia extends NuevaIncidencia {
  estado_incidencia: EstadoIncidencia;
  fecha_resolucion?: string | null;
  comentario?: string;
}

export interface IncidenciaCreada {
  id_incidencia: number;
}

export interface DetalleIncidencia {
  incidencia: Incidencia;
  comentarios: import('./seguimiento.model').Comentario[];
  adjuntos: import('./seguimiento.model').Adjunto[];
  historial: import('./seguimiento.model').HistorialIncidencia[];
  asignaciones: import('./seguimiento.model').Asignacion[];
}

export interface FiltrosIncidencia {
  estado?: string;
  prioridad?: string;
  categoria?: string;
  ubicacion?: string;
  usuario?: string;
}