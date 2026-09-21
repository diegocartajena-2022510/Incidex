import { Request, Response } from 'express';
import { pool } from '../config/db';
import { ok, error } from '../utils/respuestas';

export const listarComentarios = async (req: Request, res: Response) => {
  const { id_incidencia } = req.query;

  const condicion = id_incidencia ? 'WHERE c.id_incidencia = $1' : '';
  const valores = id_incidencia ? [id_incidencia] : [];

  const resultado = await pool.query(
    `SELECT c.id_comentario, c.id_incidencia, i.titulo_incidencia, c.id_usuario,
            concat(u.nombre_usuario, ' ', u.apellido_usuario) AS usuario,
            c.comentario, c.fecha_comentario
     FROM comentarios c
     INNER JOIN incidencias i ON c.id_incidencia = i.id_incidencia
     INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
     ${condicion}
     ORDER BY c.fecha_comentario`,
    valores
  );

  ok(res, resultado.rows);
};

export const crearComentario = async (req: Request, res: Response) => {
  const { id_incidencia, id_usuario, comentario } = req.body;
  if (!id_incidencia || !id_usuario || !comentario) {
    return error(res, 'Faltan datos obligatorios para el comentario');
  }
  await pool.query('INSERT INTO comentarios (id_incidencia, id_usuario, comentario) VALUES ($1, $2, $3)', [
    id_incidencia,
    id_usuario,
    comentario,
  ]);
  ok(res, null, 'Comentario agregado correctamente', 201);
};

export const actualizarComentario = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { id_incidencia, id_usuario, comentario } = req.body;
  await pool.query(
    'UPDATE comentarios SET id_incidencia = $1, id_usuario = $2, comentario = $3 WHERE id_comentario = $4',
    [id_incidencia, id_usuario, comentario, id]
  );
  ok(res, null, 'Comentario actualizado correctamente');
};

export const eliminarComentario = async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query('DELETE FROM comentarios WHERE id_comentario = $1', [id]);
  ok(res, null, 'Comentario eliminado correctamente');
};