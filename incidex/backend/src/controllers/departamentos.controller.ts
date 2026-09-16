import { Request, Response } from 'express';
import { pool } from '../config/db';
import { ok } from '../utils/respuestas';

export const listarDepartamentos = async (_req: Request, res: Response) => {
  const resultado = await pool.query('SELECT * FROM departamentos ORDER BY id_departamento');
  ok(res, resultado.rows);
};

export const crearDepartamento = async (req: Request, res: Response) => {
  const { nombre_departamento, descripcion } = req.body;
  await pool.query('INSERT INTO departamentos (nombre_departamento, descripcion) VALUES ($1, $2)', [
    nombre_departamento,
    descripcion,
  ]);
  ok(res, null, 'Departamento creado correctamente', 201);
};

export const actualizarDepartamento = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre_departamento, descripcion, estado_departamento } = req.body;
  await pool.query(
    'UPDATE departamentos SET nombre_departamento = $1, descripcion = $2, estado_departamento = $3 WHERE id_departamento = $4',
    [nombre_departamento, descripcion, estado_departamento, id]
  );
  ok(res, null, 'Departamento actualizado correctamente');
};

export const eliminarDepartamento = async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query('DELETE FROM departamentos WHERE id_departamento = $1', [id]);
  ok(res, null, 'Departamento eliminado correctamente');
};
