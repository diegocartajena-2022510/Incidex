export interface RespuestaApi<T> {
  ok: boolean;
  mensaje: string;
  data: T;
}
