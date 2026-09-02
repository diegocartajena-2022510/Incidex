import { Request, Response } from 'express';
import { pool } from '../config/db';
import { ok, error } from '../utils/respuestas';

export const listarComentarios = async (req: Request, res: Response) => {
  const { id_incidencia } = req.query;
  const [rows]: any = await pool.query('CALL sp_listarcomentarios()');
  const datos = id_incidencia
    ? rows[0].filter((c: any) => c.id_incidencia === Number(id_incidencia))
    : rows[0];
  ok(res, datos);
};

export const crearComentario = async (req: Request, res: Response) => {
  const { id_incidencia, id_usuario, comentario } = req.body;
  if (!id_incidencia || !id_usuario || !comentario) {
    return error(res, 'Faltan datos obligatorios para el comentario');
  }
  await pool.query('CALL sp_agregarcomentario(?, ?, ?)', [id_incidencia, id_usuario, comentario]);
  ok(res, null, 'Comentario agregado correctamente', 201);
};

export const actualizarComentario = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { id_incidencia, id_usuario, comentario } = req.body;
  await pool.query('CALL sp_actualizarcomentario(?, ?, ?, ?)', [id, id_incidencia, id_usuario, comentario]);
  ok(res, null, 'Comentario actualizado correctamente');
};

export const eliminarComentario = async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query('CALL sp_eliminarcomentario(?)', [id]);
  ok(res, null, 'Comentario eliminado correctamente');
};