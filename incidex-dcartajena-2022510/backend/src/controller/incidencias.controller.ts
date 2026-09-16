import { Request, Response } from 'express';
import { pool } from '../config/db';
import { ok, error } from '../utils/respuestas';
import { AuthRequest } from '../middlewares/auth.middleware';

export const listarIncidencias = async (req: Request, res: Response) => {
  const { estado, categoria, prioridad, ubicacion, usuario, desde, hasta } = req.query;

  const condiciones: string[] = [];
  const valores: any[] = [];
  let indice = 1;

  const agregarCondicion = (columna: string, valor: unknown) => {
    condiciones.push(`${columna} = $${indice}`);
    valores.push(valor);
    indice++;
  };

  if (estado) agregarCondicion('i.estado_incidencia', estado);
  if (categoria) agregarCondicion('i.id_categoria', categoria);
  if (prioridad) agregarCondicion('i.id_prioridad', prioridad);
  if (ubicacion) agregarCondicion('i.id_ubicacion', ubicacion);
  if (usuario) agregarCondicion('i.id_usuario', usuario);
  if (desde) {
    condiciones.push(`i.fecha_creacion >= $${indice}`);
    valores.push(desde);
    indice++;
  }
  if (hasta) {
    condiciones.push(`i.fecha_creacion <= $${indice}`);
    valores.push(hasta);
    indice++;
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

  const resultado = await pool.query(
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

  ok(res, resultado.rows);
};

export const obtenerIncidencia = async (req: Request, res: Response) => {
  const { id } = req.params;

  const incidenciaResultado = await pool.query(
    `SELECT
       i.*, concat(u.nombre_usuario, ' ', u.apellido_usuario) AS usuario,
       c.nombre_categoria, ub.nombre_ubicacion, p.nombre_prioridad
     FROM incidencias i
     INNER JOIN usuarios u ON i.id_usuario = u.id_usuario
     INNER JOIN categorias c ON i.id_categoria = c.id_categoria
     INNER JOIN ubicaciones ub ON i.id_ubicacion = ub.id_ubicacion
     INNER JOIN prioridades p ON i.id_prioridad = p.id_prioridad
     WHERE i.id_incidencia = $1`,
    [id]
  );

  if (!incidenciaResultado.rows[0]) {
    return error(res, 'Incidencia no encontrada', 404);
  }

  const [comentarios, adjuntos, historial, asignaciones] = await Promise.all([
    pool.query(
      `SELECT c.id_comentario, c.id_incidencia, c.id_usuario,
              concat(u.nombre_usuario, ' ', u.apellido_usuario) AS usuario,
              c.comentario, c.fecha_comentario
       FROM comentarios c
       INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
       WHERE c.id_incidencia = $1
       ORDER BY c.fecha_comentario`,
      [id]
    ),
    pool.query(
      `SELECT a.id_adjunto, a.id_incidencia, a.id_usuario,
              concat(u.nombre_usuario, ' ', u.apellido_usuario) AS usuario,
              a.nombre_archivo, a.ruta_archivo, a.tipo_archivo, a.fecha_archivo
       FROM adjuntos a
       INNER JOIN usuarios u ON a.id_usuario = u.id_usuario
       WHERE a.id_incidencia = $1
       ORDER BY a.fecha_archivo`,
      [id]
    ),
    pool.query(
      `SELECT h.id_historial, h.id_incidencia, h.id_usuario,
              concat(u.nombre_usuario, ' ', u.apellido_usuario) AS usuario,
              h.estado_anterior, h.estado_nuevo, h.comentario, h.fecha_cambio
       FROM historialincidencias h
       INNER JOIN usuarios u ON h.id_usuario = u.id_usuario
       WHERE h.id_incidencia = $1
       ORDER BY h.fecha_cambio DESC`,
      [id]
    ),
    pool.query(
      `SELECT a.id_asignacion, a.id_incidencia, a.id_usuario,
              concat(u.nombre_usuario, ' ', u.apellido_usuario) AS usuario,
              a.fecha_asignacion, a.fecha_finalizacion, a.observaciones, a.estado_asignacion
       FROM asignaciones a
       INNER JOIN usuarios u ON a.id_usuario = u.id_usuario
       WHERE a.id_incidencia = $1
       ORDER BY a.fecha_asignacion DESC`,
      [id]
    ),
  ]);

  ok(res, {
    incidencia: incidenciaResultado.rows[0],
    comentarios: comentarios.rows,
    adjuntos: adjuntos.rows,
    historial: historial.rows,
    asignaciones: asignaciones.rows,
  });
};

export const crearIncidencia = async (req: AuthRequest, res: Response) => {
  const { id_usuario, id_categoria, id_ubicacion, id_prioridad, titulo_incidencia, descripcion_incidencia } =
    req.body;

  if (!id_usuario || !id_categoria || !id_ubicacion || !id_prioridad || !titulo_incidencia) {
    return error(res, 'Faltan datos obligatorios para registrar la incidencia');
  }

  const cliente = await pool.connect();
  try {
    await cliente.query('BEGIN');

    const incidenciaResultado = await cliente.query(
      `INSERT INTO incidencias (id_usuario, id_categoria, id_ubicacion, id_prioridad, titulo_incidencia, descripcion_incidencia)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id_incidencia`,
      [id_usuario, id_categoria, id_ubicacion, id_prioridad, titulo_incidencia, descripcion_incidencia]
    );
    const idIncidencia = incidenciaResultado.rows[0].id_incidencia;

    await cliente.query(
      `INSERT INTO historialincidencias (id_incidencia, id_usuario, estado_anterior, estado_nuevo, comentario)
       VALUES ($1, $2, $3, $4, $5)`,
      [idIncidencia, id_usuario, null, 'Pendiente', 'Incidencia registrada en el sistema']
    );

    await cliente.query('COMMIT');
    ok(res, { id_incidencia: idIncidencia }, 'Incidencia registrada correctamente', 201);
  } catch (err) {
    await cliente.query('ROLLBACK');
    throw err;
  } finally {
    cliente.release();
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

  const actualResultado = await pool.query('SELECT estado_incidencia FROM incidencias WHERE id_incidencia = $1', [
    id,
  ]);
  if (!actualResultado.rows[0]) {
    return error(res, 'Incidencia no encontrada', 404);
  }
  const estadoAnterior = actualResultado.rows[0].estado_incidencia;

  const cliente = await pool.connect();
  try {
    await cliente.query('BEGIN');

    await cliente.query(
      `UPDATE incidencias
       SET id_usuario = $1, id_categoria = $2, id_ubicacion = $3, id_prioridad = $4,
           titulo_incidencia = $5, descripcion_incidencia = $6, estado_incidencia = $7, fecha_resolucion = $8
       WHERE id_incidencia = $9`,
      [
        id_usuario,
        id_categoria,
        id_ubicacion,
        id_prioridad,
        titulo_incidencia,
        descripcion_incidencia,
        estado_incidencia,
        fecha_resolucion || null,
        id,
      ]
    );

    if (estado_incidencia && estado_incidencia !== estadoAnterior && req.usuario) {
      const usuarioResultado = await cliente.query('SELECT id_usuario FROM usuarios WHERE id_login = $1', [
        req.usuario.id_login,
      ]);
      const idUsuarioHistorial = usuarioResultado.rows[0]?.id_usuario || id_usuario;

      await cliente.query(
        `INSERT INTO historialincidencias (id_incidencia, id_usuario, estado_anterior, estado_nuevo, comentario)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          id,
          idUsuarioHistorial,
          estadoAnterior,
          estado_incidencia,
          comentario || `Estado actualizado de ${estadoAnterior} a ${estado_incidencia}`,
        ]
      );
    }

    await cliente.query('COMMIT');
    ok(res, null, 'Incidencia actualizada correctamente');
  } catch (err) {
    await cliente.query('ROLLBACK');
    throw err;
  } finally {
    cliente.release();
  }
};

export const eliminarIncidencia = async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query('DELETE FROM incidencias WHERE id_incidencia = $1', [id]);
  ok(res, null, 'Incidencia eliminada correctamente');
};
