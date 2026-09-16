import { Request, Response } from 'express';
import { pool } from '../config/db';
import { ok, error } from '../utils/respuestas';

export const listarUsuarios = async (_req: Request, res: Response) => {
  const resultado = await pool.query(
    `SELECT u.id_usuario, l.id_login, u.id_departamento, u.nombre_usuario, u.apellido_usuario,
            u.telefono, u.estado_usuario, l.usuario_login, l.correo_login, l.rol_login,
            d.nombre_departamento
     FROM usuarios u
     LEFT JOIN login l ON u.id_login = l.id_login
     LEFT JOIN departamentos d ON u.id_departamento = d.id_departamento
     ORDER BY u.id_usuario`
  );
  ok(res, resultado.rows);
};

export const crearUsuario = async (req: Request, res: Response) => {
  const { correo, usuario, contrasena, rol, id_departamento, nombre, apellido, telefono } = req.body;

  if (!correo || !usuario || !contrasena || !rol || !nombre || !apellido) {
    return error(res, 'Faltan datos obligatorios para crear el usuario');
  }

  const cliente = await pool.connect();
  try {
    await cliente.query('BEGIN');

    const loginResultado = await cliente.query(
      'INSERT INTO login (correo_login, usuario_login, contrasena_login, rol_login) VALUES ($1, $2, $3, $4) RETURNING id_login',
      [correo, usuario, contrasena, rol]
    );
    const idLogin = loginResultado.rows[0].id_login;

    await cliente.query(
      'INSERT INTO usuarios (id_login, id_departamento, nombre_usuario, apellido_usuario, telefono) VALUES ($1, $2, $3, $4, $5)',
      [idLogin, id_departamento || null, nombre, apellido, telefono || null]
    );

    await cliente.query('COMMIT');
    ok(res, { id_login: idLogin }, 'Usuario creado correctamente', 201);
  } catch (err) {
    await cliente.query('ROLLBACK');
    throw err;
  } finally {
    cliente.release();
  }
};

export const actualizarUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { id_login, id_departamento, nombre_usuario, apellido_usuario, telefono, estado_usuario } = req.body;
  await pool.query(
    `UPDATE usuarios
     SET id_login = $1, id_departamento = $2, nombre_usuario = $3, apellido_usuario = $4,
         telefono = $5, estado_usuario = $6
     WHERE id_usuario = $7`,
    [id_login, id_departamento, nombre_usuario, apellido_usuario, telefono, estado_usuario, id]
  );
  ok(res, null, 'Usuario actualizado correctamente');
};

export const eliminarUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query('DELETE FROM usuarios WHERE id_usuario = $1', [id]);
  ok(res, null, 'Usuario eliminado correctamente');
};
