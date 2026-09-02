import { Request, Response } from 'express';
import { pool } from '../config/db';
import { ok } from '../utils/respuestas';

export const listarCategorias = async (_req: Request, res: Response) => {
  const [rows]: any = await pool.query('CALL sp_listarcategorias()');
  ok(res, rows[0]);
};

export const crearCategoria = async (req: Request, res: Response) => {
  const { id_departamento, nombre_categoria, descripcion } = req.body;
  await pool.query('CALL sp_agregarcategoria(?, ?, ?)', [id_departamento, nombre_categoria, descripcion]);
  ok(res, null, 'Categoria creada correctamente', 201);
};

export const actualizarCategoria = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { id_departamento, nombre_categoria, descripcion, estado_categoria } = req.body;
  await pool.query('CALL sp_actualizarcategoria(?, ?, ?, ?, ?)', [
    id,
    id_departamento,
    nombre_categoria,
    descripcion,
    estado_categoria,
  ]);
  ok(res, null, 'Categoria actualizada correctamente');
};

export const eliminarCategoria = async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query('CALL sp_eliminarcategoria(?)', [id]);
  ok(res, null, 'Categoria eliminada correctamente');
};
