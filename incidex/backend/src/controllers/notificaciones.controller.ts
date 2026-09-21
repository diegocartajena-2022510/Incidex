import { Response } from 'express';
import { pool } from '../config/db';
import { ok } from '../utils/respuestas';
import { AuthRequest } from '../middlewares/auth.middleware';

async function obtenerIdUsuario(idLogin: number): Promise<number | null> {
  const resultado = await pool.query('SELECT id_usuario FROM usuarios WHERE id_login = $1', [idLogin]);
  return resultado.rows[0]?.id_usuario ?? null;
}

export const listarNotificaciones = async (req: AuthRequest, res: Response) => {
  const idUsuario = await obtenerIdUsuario(req.usuario!.id_login);
  if (!idUsuario) return ok(res, []);

  const resultado = await pool.query(
    `SELECT n.id_notificacion, n.id_incidencia, i.titulo_incidencia, n.mensaje, n.leida, n.fecha_creacion
     FROM notificaciones n
     LEFT JOIN incidencias i ON n.id_incidencia = i.id_incidencia
     WHERE n.id_usuario = $1
     ORDER BY n.fecha_creacion DESC
     LIMIT 30`,
    [idUsuario]
  );

  ok(res, resultado.rows);
};

export const marcarLeida = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const idUsuario = await obtenerIdUsuario(req.usuario!.id_login);

  await pool.query('UPDATE notificaciones SET leida = TRUE WHERE id_notificacion = $1 AND id_usuario = $2', [
    id,
    idUsuario,
  ]);
  ok(res, null, 'Notificacion marcada como leida');
};

export const marcarTodasLeidas = async (req: AuthRequest, res: Response) => {
  const idUsuario = await obtenerIdUsuario(req.usuario!.id_login);
  await pool.query('UPDATE notificaciones SET leida = TRUE WHERE id_usuario = $1 AND leida = FALSE', [idUsuario]);
  ok(res, null, 'Notificaciones marcadas como leidas');
};
