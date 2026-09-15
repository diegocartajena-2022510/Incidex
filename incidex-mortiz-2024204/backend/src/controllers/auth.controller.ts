import { Request, Response } from 'express';
import { pool } from '../config/db';
import { generarToken } from '../utils/jwt';
import { ok, error } from '../utils/respuestas';
import { AuthRequest } from '../middlewares/auth.middleware';

export const iniciarSesion = async (req: Request, res: Response) => {
  const { usuario, contrasena } = req.body;
  if (!usuario || !contrasena) {
    return error(res, 'Usuario y contrasena son requeridos');
  }

  const resultado = await pool.query(
    'SELECT * FROM login WHERE (usuario_login = $1 OR correo_login = $1) AND estado_login = TRUE',
    [usuario]
  );
  const cuenta = resultado.rows[0];

  if (!cuenta || cuenta.contrasena_login !== contrasena) {
    return error(res, 'Credenciales invalidas', 401);
  }

  const token = generarToken({
    id_login: cuenta.id_login,
    usuario_login: cuenta.usuario_login,
    rol_login: cuenta.rol_login,
  });

  const usuarioResultado = await pool.query(
    'SELECT id_usuario, nombre_usuario, apellido_usuario, id_departamento FROM usuarios WHERE id_login = $1',
    [cuenta.id_login]
  );

  ok(res, {
    token,
    usuario: {
      id_login: cuenta.id_login,
      usuario_login: cuenta.usuario_login,
      correo_login: cuenta.correo_login,
      rol_login: cuenta.rol_login,
      perfil: usuarioResultado.rows[0] || null,
    },
  });
};

export const perfilActual = async (req: AuthRequest, res: Response) => {
  ok(res, req.usuario);
};
