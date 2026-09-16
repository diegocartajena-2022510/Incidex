import { Request, Response } from 'express';
import { pool } from '../config/db';
import { ok } from '../utils/respuestas';

export const listarPrioridades = async (_req: Request, res: Response) => {
  const resultado = await pool.query('SELECT * FROM prioridades ORDER BY id_prioridad');
  ok(res, resultado.rows);
};

export const crearPrioridad = async (req: Request, res: Response) => {
  const { nombre_prioridad, descripcion } = req.body;
  await pool.query('INSERT INTO prioridades (nombre_prioridad, descripcion) VALUES ($1, $2)', [
    nombre_prioridad,
    descripcion,
  ]);
  ok(res, null, 'Prioridad creada correctamente', 201);
};

export const actualizarPrioridad = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre_prioridad, descripcion, estado_prioridad } = req.body;
  await pool.query(
    'UPDATE prioridades SET nombre_prioridad = $1, descripcion = $2, estado_prioridad = $3 WHERE id_prioridad = $4',
    [nombre_prioridad, descripcion, estado_prioridad, id]
  );
  ok(res, null, 'Prioridad actualizada correctamente');
};

export const eliminarPrioridad = async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query('DELETE FROM prioridades WHERE id_prioridad = $1', [id]);
  ok(res, null, 'Prioridad eliminada correctamente');
};
