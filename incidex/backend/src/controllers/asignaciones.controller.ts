import { Request, Response } from 'express';
import { pool } from '../config/db';
import { ok, error } from '../utils/respuestas';

export const listarAsignaciones = async (_req: Request, res: Response) => {
  const [rows]: any = await pool.query('CALL sp_listarasignaciones()');
  ok(res, rows[0]);
};

export const crearAsignacion = async (req: Request, res: Response) => {
  const { id_incidencia, id_usuario, observaciones } = req.body;
  if (!id_incidencia || !id_usuario) {
    return error(res, 'Faltan datos obligatorios para asignar la incidencia');
  }
  await pool.query('CALL sp_agregarasignacion(?, ?, ?)', [id_incidencia, id_usuario, observaciones || null]);
  ok(res, null, 'Asignacion creada correctamente', 201);
};

export const actualizarAsignacion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { id_incidencia, id_usuario, fecha_finalizacion, observaciones, estado_asignacion } = req.body;
  await pool.query('CALL sp_actualizarasignacion(?, ?, ?, ?, ?, ?)', [
    id,
    id_incidencia,
    id_usuario,
    fecha_finalizacion || null,
    observaciones,
    estado_asignacion,
  ]);
  ok(res, null, 'Asignacion actualizada correctamente');
};

export const eliminarAsignacion = async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query('CALL sp_eliminarasignacion(?)', [id]);
  ok(res, null, 'Asignacion eliminada correctamente');
};
