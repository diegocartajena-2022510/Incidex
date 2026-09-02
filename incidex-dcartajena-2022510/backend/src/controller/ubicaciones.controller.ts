import { Request, Response } from 'express';
import { pool } from '../config/db';
import { ok } from '../utils/respuestas';

export const listarUbicaciones = async (req: Request, res: Response) => {
  const [rows]: any = await pool.query('CALL sp_listarubicaciones()');
  ok(res, rows[0]);
};

export const crearUbicacion = async (req: Request, res: Response) => {
  const { nombre_ubicacion, nivel, descripcion } = req.body;
  await pool.query('CALL sp_agregarubicacion(?, ?, ?)', [nombre_ubicacion, nivel, descripcion]);
  ok(res, null, 'Ubicacion creada correctamente', 201);
};

export const actualizarUbicacion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre_ubicacion, nivel, descripcion, estado_ubicacion } = req.body;
  await pool.query('CALL sp_actualizarubicacion(?, ?, ?, ?, ?)', [
    id,
    nombre_ubicacion,
    nivel,
    descripcion,
    estado_ubicacion,
  ]);
  ok(res, null, 'Ubicacion actualizada correctamente');
};

export const eliminarUbicacion = async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query('CALL sp_eliminarubicacion(?)', [id]);
  ok(res, null, 'Ubicacion eliminada correctamente');
};