import { Request, Response } from 'express';
import { pool } from '../config/db';
import { ok } from '../utils/respuestas';

export const listarHistorial = async (req: Request, res: Response) => {
  const { id_incidencia } = req.query;
  const [rows]: any = await pool.query('CALL sp_listarhistorial()');
  const datos = id_incidencia
    ? rows[0].filter((h: any) => h.id_incidencia === Number(id_incidencia))
    : rows[0];
  ok(res, datos);
};

export const eliminarHistorial = async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query('CALL sp_eliminarhistorial(?)', [id]);
  ok(res, null, 'Registro de historial eliminado correctamente');
};
