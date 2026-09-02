import { Request, Response } from 'express';
import { pool } from '../config/db';
import { ok, error } from '../utils/respuestas';

export const listarUsuarios = async (_req: Request, res: Response) => {
  const [rows]: any = await pool.query('CALL sp_listarusuarios()');
  ok(res, rows[0]);
};

export const crearUsuario = async (req: Request, res: Response) => {
  const { correo, usuario, contrasena, rol, id_departamento, nombre, apellido, telefono } = req.body;

  if (!correo || !usuario || !contrasena || !rol || !nombre || !apellido) {
    return error(res, 'Faltan datos obligatorios para crear el usuario');
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query('CALL sp_agregarlogin(?, ?, ?, ?)', [correo, usuario, contrasena, rol]);
    const [idRows]: any = await conn.query('SELECT LAST_INSERT_ID() AS id');
    const idLogin = idRows[0].id;

    await conn.query('CALL sp_agregarusuario(?, ?, ?, ?, ?)', [
      idLogin,
      id_departamento || null,
      nombre,
      apellido,
      telefono || null,
    ]);

    await conn.commit();
    ok(res, { id_login: idLogin }, 'Usuario creado correctamente', 201);
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const actualizarUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { id_login, id_departamento, nombre_usuario, apellido_usuario, telefono, estado_usuario } = req.body;
  await pool.query('CALL sp_actualizarusuario(?, ?, ?, ?, ?, ?, ?)', [
    id,
    id_login,
    id_departamento,
    nombre_usuario,
    apellido_usuario,
    telefono,
    estado_usuario,
  ]);
  ok(res, null, 'Usuario actualizado correctamente');
};

export const eliminarUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query('CALL sp_eliminarusuario(?)', [id]);
  ok(res, null, 'Usuario eliminado correctamente');
};
