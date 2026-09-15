import { Request, Response } from 'express';
import { pool } from '../config/db';
import { ok, error } from '../utils/respuestas';

export const listarAdjuntos = async (req: Request, res: Response) => {
  const { id_incidencia } = req.query;

  const condicion = id_incidencia ? 'WHERE a.id_incidencia = $1' : '';
  const valores = id_incidencia ? [id_incidencia] : [];

  const resultado = await pool.query(
    `SELECT a.id_adjunto, a.id_incidencia, i.titulo_incidencia, a.id_usuario,
            concat(u.nombre_usuario, ' ', u.apellido_usuario) AS usuario,
            a.nombre_archivo, a.ruta_archivo, a.tipo_archivo, a.fecha_archivo
     FROM adjuntos a
     INNER JOIN incidencias i ON a.id_incidencia = i.id_incidencia
     INNER JOIN usuarios u ON a.id_usuario = u.id_usuario
     ${condicion}
     ORDER BY a.fecha_archivo DESC`,
    valores
  );

  ok(res, resultado.rows);
};

export const crearAdjunto = async (req: Request, res: Response) => {
  const { id_incidencia, id_usuario } = req.body;
  const archivo = req.file;

  if (!id_incidencia || !id_usuario || !archivo) {
    return error(res, 'Faltan datos obligatorios o no se recibio ningun archivo');
  }

  const rutaArchivo = `/uploads/incidencias/${archivo.filename}`;
  await pool.query(
    'INSERT INTO adjuntos (id_incidencia, id_usuario, nombre_archivo, ruta_archivo, tipo_archivo) VALUES ($1, $2, $3, $4, $5)',
    [id_incidencia, id_usuario, archivo.originalname, rutaArchivo, archivo.mimetype]
  );

  ok(res, { ruta_archivo: rutaArchivo }, 'Archivo adjuntado correctamente', 201);
};

export const eliminarAdjunto = async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query('DELETE FROM adjuntos WHERE id_adjunto = $1', [id]);
  ok(res, null, 'Adjunto eliminado correctamente');
};
