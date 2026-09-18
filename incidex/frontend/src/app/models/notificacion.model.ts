export interface Notificacion {
  id_notificacion: number;
  id_incidencia: number | null;
  titulo_incidencia: string | null;
  mensaje: string;
  leida: boolean;
  fecha_creacion: string;
}
