import { Request, Response } from 'express';
import { pool } from '../config/db';
import { ok } from '../utils/respuestas';

export const listarDepartamentos = async (_req: Request, res: Response) => {
  const [rows]: any = await pool.query('CALL sp_listardepartamentos()');
  ok(res, rows[0]);
};

export const crearDepartamento = async (req: Request, res: Response) => {
  const { nombre_departamento, descripcion } = req.body;
  await pool.query('CALL sp_agregardepartamento(?, ?)', [nombre_departamento, descripcion]);
  ok(res, null, 'Departamento creado correctamente', 201);
};

export const actualizarDepartamento = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre_departamento, descripcion, estado_departamento } = req.body;
  await pool.query('CALL sp_actualizardepartamento(?, ?, ?, ?)', [
    id,
    nombre_departamento,
    descripcion,
    estado_departamento,
  ]);
  ok(res, null, 'Departamento actualizado correctamente');
};

export const eliminarDepartamento = async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query('CALL sp_eliminardepartamento(?)', [id]);
  ok(res, null, 'Departamento eliminado correctamente');
};
