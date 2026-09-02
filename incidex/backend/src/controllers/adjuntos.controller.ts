import { Request, Response } from 'express';
import { pool } from '../config/db';
import { ok, error } from '../utils/respuestas';

export const listarAdjuntos = async (req: Request, res: Response) => {
  const { id_incidencia } = req.query;
  const [rows]: any = await pool.query('CALL sp_listaradjuntos()');
  const datos = id_incidencia
    ? rows[0].filter((a: any) => a.id_incidencia === Number(id_incidencia))
    : rows[0];
  ok(res, datos);
};

export const crearAdjunto = async (req: Request, res: Response) => {
  const { id_incidencia, id_usuario } = req.body;
  const archivo = req.file;

  if (!id_incidencia || !id_usuario || !archivo) {
    return error(res, 'Faltan datos obligatorios o no se recibio ningun archivo');
  }

  const rutaArchivo = `/uploads/incidencias/${archivo.filename}`;
  await pool.query('CALL sp_agregaradjunto(?, ?, ?, ?, ?)', [
    id_incidencia,
    id_usuario,
    archivo.originalname,
    rutaArchivo,
    archivo.mimetype,
  ]);

  ok(res, { ruta_archivo: rutaArchivo }, 'Archivo adjuntado correctamente', 201);
};

export const eliminarAdjunto = async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query('CALL sp_eliminaradjunto(?)', [id]);
  ok(res, null, 'Adjunto eliminado correctamente');
};
