import { Request, Response } from 'express';
import { pool } from '../config/db';
import { ok } from '../utils/respuestas';

export const listarPrioridades = async (_req: Request, res: Response) => {
  const [rows]: any = await pool.query('CALL sp_listarprioridades()');
  ok(res, rows[0]);
};

export const crearPrioridad = async (req: Request, res: Response) => {
  const { nombre_prioridad, descripcion } = req.body;
  await pool.query('CALL sp_agregarprioridad(?, ?)', [nombre_prioridad, descripcion]);
  ok(res, null, 'Prioridad creada correctamente', 201);
};

export const actualizarPrioridad = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre_prioridad, descripcion, estado_prioridad } = req.body;
  await pool.query('CALL sp_actualizarprioridad(?, ?, ?, ?)', [
    id,
    nombre_prioridad,
    descripcion,
    estado_prioridad,
  ]);
  ok(res, null, 'Prioridad actualizada correctamente');
};

export const eliminarPrioridad = async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query('CALL sp_eliminarprioridad(?)', [id]);
  ok(res, null, 'Prioridad eliminada correctamente');
};
