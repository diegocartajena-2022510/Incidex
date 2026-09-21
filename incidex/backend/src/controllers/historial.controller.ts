import { Request, Response } from 'express';
import { pool } from '../config/db';
import { ok } from '../utils/respuestas';

export const listarHistorial = async (req: Request, res: Response) => {
  const { id_incidencia } = req.query;

  const condicion = id_incidencia ? 'WHERE h.id_incidencia = $1' : '';
  const valores = id_incidencia ? [id_incidencia] : [];

  const resultado = await pool.query(
    `SELECT h.id_historial, h.id_incidencia, i.titulo_incidencia, h.id_usuario,
            concat(u.nombre_usuario, ' ', u.apellido_usuario) AS usuario,
            h.estado_anterior, h.estado_nuevo, h.comentario, h.fecha_cambio
     FROM historialincidencias h
     INNER JOIN incidencias i ON h.id_incidencia = i.id_incidencia
     INNER JOIN usuarios u ON h.id_usuario = u.id_usuario
     ${condicion}
     ORDER BY h.fecha_cambio DESC`,
    valores
  );

  ok(res, resultado.rows);
};

export const eliminarHistorial = async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query('DELETE FROM historialincidencias WHERE id_historial = $1', [id]);
  ok(res, null, 'Registro de historial eliminado correctamente');
};