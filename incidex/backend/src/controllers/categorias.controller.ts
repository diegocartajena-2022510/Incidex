import { Request, Response } from 'express';
import { pool } from '../config/db';
import { ok } from '../utils/respuestas';

export const listarCategorias = async (_req: Request, res: Response) => {
  const resultado = await pool.query(
    `SELECT c.id_categoria, c.id_departamento, c.nombre_categoria, c.descripcion, c.estado_categoria,
            d.nombre_departamento
     FROM categorias c
     INNER JOIN departamentos d ON c.id_departamento = d.id_departamento
     ORDER BY c.id_categoria`
  );
  ok(res, resultado.rows);
};

export const crearCategoria = async (req: Request, res: Response) => {
  const { id_departamento, nombre_categoria, descripcion } = req.body;
  await pool.query('INSERT INTO categorias (id_departamento, nombre_categoria, descripcion) VALUES ($1, $2, $3)', [
    id_departamento,
    nombre_categoria,
    descripcion,
  ]);
  ok(res, null, 'Categoria creada correctamente', 201);
};

export const actualizarCategoria = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { id_departamento, nombre_categoria, descripcion, estado_categoria } = req.body;
  await pool.query(
    'UPDATE categorias SET id_departamento = $1, nombre_categoria = $2, descripcion = $3, estado_categoria = $4 WHERE id_categoria = $5',
    [id_departamento, nombre_categoria, descripcion, estado_categoria, id]
  );
  ok(res, null, 'Categoria actualizada correctamente');
};

export const eliminarCategoria = async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query('DELETE FROM categorias WHERE id_categoria = $1', [id]);
  ok(res, null, 'Categoria eliminada correctamente');
};
