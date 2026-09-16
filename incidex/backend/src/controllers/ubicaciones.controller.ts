import { Request, Response } from 'express';
import { pool } from '../config/db';
import { ok } from '../utils/respuestas';

export const listarUbicaciones = async (_req: Request, res: Response) => {
  const resultado = await pool.query('SELECT * FROM ubicaciones ORDER BY id_ubicacion');
  ok(res, resultado.rows);
};

export const crearUbicacion = async (req: Request, res: Response) => {
  const { nombre_ubicacion, nivel, descripcion } = req.body;
  await pool.query('INSERT INTO ubicaciones (nombre_ubicacion, nivel, descripcion) VALUES ($1, $2, $3)', [
    nombre_ubicacion,
    nivel,
    descripcion,
  ]);
  ok(res, null, 'Ubicacion creada correctamente', 201);
};

export const actualizarUbicacion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre_ubicacion, nivel, descripcion, estado_ubicacion } = req.body;
  await pool.query(
    'UPDATE ubicaciones SET nombre_ubicacion = $1, nivel = $2, descripcion = $3, estado_ubicacion = $4 WHERE id_ubicacion = $5',
    [nombre_ubicacion, nivel, descripcion, estado_ubicacion, id]
  );
  ok(res, null, 'Ubicacion actualizada correctamente');
};

export const eliminarUbicacion = async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query('DELETE FROM ubicaciones WHERE id_ubicacion = $1', [id]);
  ok(res, null, 'Ubicacion eliminada correctamente');
};
