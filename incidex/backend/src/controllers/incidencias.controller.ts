import { Request, Response } from 'express';
import { pool } from '../config/db';
import { ok, error } from '../utils/respuestas';
import { AuthRequest } from '../middlewares/auth.middleware';

export const listarIncidencias = async (req: Request, res: Response) => {
  const { estado, categoria, prioridad, ubicacion, usuario, desde, hasta } = req.query;

  const condiciones: string[] = [];
  const valores: any[] = [];

  if (estado) {
    condiciones.push('i.estado_incidencia = ?');
    valores.push(estado);
  }
  if (categoria) {
    condiciones.push('i.id_categoria = ?');
    valores.push(categoria);
  }
  if (prioridad) {
    condiciones.push('i.id_prioridad = ?');
    valores.push(prioridad);
  }
  if (ubicacion) {
    condiciones.push('i.id_ubicacion = ?');
    valores.push(ubicacion);
  }
  if (usuario) {
    condiciones.push('i.id_usuario = ?');
    valores.push(usuario);
  }
  if (desde) {
    condiciones.push('i.fecha_creacion >= ?');
    valores.push(desde);
  }
  if (hasta) {
    condiciones.push('i.fecha_creacion <= ?');
    valores.push(hasta);
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `SELECT
       i.id_incidencia, i.titulo_incidencia, i.descripcion_incidencia, i.estado_incidencia,
       i.fecha_creacion, i.fecha_resolucion,
       i.id_usuario, concat(u.nombre_usuario, ' ', u.apellido_usuario) AS usuario,
       i.id_categoria, c.nombre_categoria,
       i.id_ubicacion, ub.nombre_ubicacion,
       i.id_prioridad, p.nombre_prioridad
     FROM incidencias i
     INNER JOIN usuarios u ON i.id_usuario = u.id_usuario
     INNER JOIN categorias c ON i.id_categoria = c.id_categoria
     INNER JOIN ubicaciones ub ON i.id_ubicacion = ub.id_ubicacion
     INNER JOIN prioridades p ON i.id_prioridad = p.id_prioridad
     ${where}
     ORDER BY i.fecha_creacion DESC`,
    valores
  );

  ok(res, rows);
};

export const obtenerIncidencia = async (req: Request, res: Response) => {
  const { id } = req.params;
  const [rows]: any = await pool.query(
    `SELECT
       i.*, concat(u.nombre_usuario, ' ', u.apellido_usuario) AS usuario,
       c.nombre_categoria, ub.nombre_ubicacion, p.nombre_prioridad
     FROM incidencias i
     INNER JOIN usuarios u ON i.id_usuario = u.id_usuario
     INNER JOIN categorias c ON i.id_categoria = c.id_categoria
     INNER JOIN ubicaciones ub ON i.id_ubicacion = ub.id_ubicacion
     INNER JOIN prioridades p ON i.id_prioridad = p.id_prioridad
     WHERE i.id_incidencia = ?`,
    [id]
  );

  if (!rows[0]) {
    return error(res, 'Incidencia no encontrada', 404);
  }

  const [comentarios] = await pool.query('CALL sp_listarcomentarios()');
  const [adjuntos] = await pool.query('CALL sp_listaradjuntos()');
  const [historial] = await pool.query('CALL sp_listarhistorial()');
  const [asignaciones] = await pool.query('CALL sp_listarasignaciones()');

  ok(res, {
    incidencia: rows[0],
    comentarios: (comentarios as any)[0].filter((c: any) => c.id_incidencia === Number(id)),
    adjuntos: (adjuntos as any)[0].filter((a: any) => a.id_incidencia === Number(id)),
    historial: (historial as any)[0].filter((h: any) => h.id_incidencia === Number(id)),
    asignaciones: (asignaciones as any)[0].filter((a: any) => a.id_incidencia === Number(id)),
  });
};

export const crearIncidencia = async (req: AuthRequest, res: Response) => {
  const { id_usuario, id_categoria, id_ubicacion, id_prioridad, titulo_incidencia, descripcion_incidencia } =
    req.body;

  if (!id_usuario || !id_categoria || !id_ubicacion || !id_prioridad || !titulo_incidencia) {
    return error(res, 'Faltan datos obligatorios para registrar la incidencia');
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query('CALL sp_agregarincidencia(?, ?, ?, ?, ?, ?)', [
      id_usuario,
      id_categoria,
      id_ubicacion,
      id_prioridad,
      titulo_incidencia,
      descripcion_incidencia,
    ]);
    const [idRows]: any = await conn.query('SELECT LAST_INSERT_ID() AS id');
    const idIncidencia = idRows[0].id;

    await conn.query('CALL sp_agregarhistorial(?, ?, ?, ?, ?)', [
      idIncidencia,
      id_usuario,
      null,
      'Pendiente',
      'Incidencia registrada en el sistema',
    ]);

    await conn.commit();
    ok(res, { id_incidencia: idIncidencia }, 'Incidencia registrada correctamente', 201);
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const actualizarIncidencia = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const {
    id_usuario,
    id_categoria,
    id_ubicacion,
    id_prioridad,
    titulo_incidencia,
    descripcion_incidencia,
    estado_incidencia,
    fecha_resolucion,
    comentario,
  } = req.body;

  const [actualRows]: any = await pool.query('SELECT estado_incidencia FROM incidencias WHERE id_incidencia = ?', [
    id,
  ]);
  if (!actualRows[0]) {
    return error(res, 'Incidencia no encontrada', 404);
  }
  const estadoAnterior = actualRows[0].estado_incidencia;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query('CALL sp_actualizarincidencia(?, ?, ?, ?, ?, ?, ?, ?, ?)', [
      id,
      id_usuario,
      id_categoria,
      id_ubicacion,
      id_prioridad,
      titulo_incidencia,
      descripcion_incidencia,
      estado_incidencia,
      fecha_resolucion || null,
    ]);

    if (estado_incidencia && estado_incidencia !== estadoAnterior && req.usuario) {
      const [usuarioRows]: any = await conn.query('SELECT id_usuario FROM usuarios WHERE id_login = ?', [
        req.usuario.id_login,
      ]);
      const idUsuarioHistorial = usuarioRows[0]?.id_usuario || id_usuario;

      await conn.query('CALL sp_agregarhistorial(?, ?, ?, ?, ?)', [
        id,
        idUsuarioHistorial,
        estadoAnterior,
        estado_incidencia,
        comentario || `Estado actualizado de ${estadoAnterior} a ${estado_incidencia}`,
      ]);
    }

    await conn.commit();
    ok(res, null, 'Incidencia actualizada correctamente');
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const eliminarIncidencia = async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query('CALL sp_eliminarincidencia(?)', [id]);
  ok(res, null, 'Incidencia eliminada correctamente');
};
