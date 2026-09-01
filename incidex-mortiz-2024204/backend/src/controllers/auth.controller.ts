import { Request, Response } from 'express';
import { pool } from '../config/db';
import { RowDataPacket } from 'mysql2';
import { generarToken } from '../utils/jwt';
import { ok, error } from '../utils/respuestas';
import { Login } from '../types';
import { AuthRequest } from '../middlewares/auth.middleware';

interface LoginRow extends Login, RowDataPacket {}

export const iniciarSesion = async (req: Request, res: Response) => {
  const { usuario, contrasena } = req.body;
  if (!usuario || !contrasena) {
    return error(res, 'Usuario y contrasena son requeridos');
  }

  const [rows] = await pool.query<LoginRow[]>(
    'SELECT * FROM Login WHERE (usuario_login = ? OR correo_login = ?) AND estado_login = TRUE',
    [usuario, usuario]
  );
  const cuenta = rows[0];

  if (!cuenta || cuenta.contrasena_login !== contrasena) {
    return error(res, 'Credenciales invalidas', 401);
  }

  const token = generarToken({
    id_login: cuenta.id_login,
    usuario_login: cuenta.usuario_login,
    rol_login: cuenta.rol_login,
  });

  const [usuarioRows]: any = await pool.query(
    'SELECT id_usuario, nombre_usuario, apellido_usuario, id_departamento FROM Usuarios WHERE id_login = ?',
    [cuenta.id_login]
  );

  ok(res, {
    token,
    usuario: {
      id_login: cuenta.id_login,
      usuario_login: cuenta.usuario_login,
      correo_login: cuenta.correo_login,
      rol_login: cuenta.rol_login,
      perfil: usuarioRows[0] || null,
    },
  });
};

export const perfilActual = async (req: AuthRequest, res: Response) => {
  ok(res, req.usuario);
};
