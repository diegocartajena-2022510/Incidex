import { Request, Response } from 'express';
import { pool } from '../config/db';
import { ok, error } from '../utils/respuestas';

export const listarAsignaciones = async (_req: Request, res: Response) => {
  const resultado = await pool.query(
    `SELECT a.id_asignacion, a.id_incidencia, i.titulo_incidencia, a.id_usuario,
            concat(u.nombre_usuario, ' ', u.apellido_usuario) AS usuario,
            a.fecha_asignacion, a.fecha_finalizacion, a.observaciones, a.estado_asignacion
     FROM asignaciones a
     INNER JOIN usuarios u ON a.id_usuario = u.id_usuario
     INNER JOIN incidencias i ON a.id_incidencia = i.id_incidencia
     ORDER BY a.fecha_asignacion DESC`
  );
  ok(res, resultado.rows);
};

export const crearAsignacion = async (req: Request, res: Response) => {
  const { id_incidencia, id_usuario, observaciones } = req.body;
  if (!id_incidencia || !id_usuario) {
    return error(res, 'Faltan datos obligatorios para asignar la incidencia');
  }

  const cliente = await pool.connect();
  try {
    await cliente.query('BEGIN');

    await cliente.query('INSERT INTO asignaciones (id_incidencia, id_usuario, observaciones) VALUES ($1, $2, $3)', [
      id_incidencia,
      id_usuario,
      observaciones || null,
    ]);

    const incidenciaResultado = await cliente.query(
      'SELECT titulo_incidencia FROM incidencias WHERE id_incidencia = $1',
      [id_incidencia]
    );
    const titulo = incidenciaResultado.rows[0]?.titulo_incidencia || 'una incidencia';

    await cliente.query(
      `INSERT INTO notificaciones (id_usuario, id_incidencia, mensaje)
       VALUES ($1, $2, $3)`,
      [id_usuario, id_incidencia, `Se te asignó la incidencia: "${titulo}"`]
    );

    await cliente.query('COMMIT');
    ok(res, null, 'Asignacion creada correctamente', 201);
  } catch (err) {
    await cliente.query('ROLLBACK');
    throw err;
  } finally {
    cliente.release();
  }
};

export const actualizarAsignacion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { id_incidencia, id_usuario, fecha_finalizacion, observaciones, estado_asignacion } = req.body;
  await pool.query(
    `UPDATE asignaciones
     SET id_incidencia = $1, id_usuario = $2, fecha_finalizacion = $3, observaciones = $4, estado_asignacion = $5
     WHERE id_asignacion = $6`,
    [id_incidencia, id_usuario, fecha_finalizacion || null, observaciones, estado_asignacion, id]
  );
  ok(res, null, 'Asignacion actualizada correctamente');
};

export const eliminarAsignacion = async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query('DELETE FROM asignaciones WHERE id_asignacion = $1', [id]);
  ok(res, null, 'Asignacion eliminada correctamente');
};
