import { Request, Response, NextFunction } from 'express';
import { verificarToken, TokenPayload } from '../utils/jwt';
import { Rol } from '../types';

export interface AuthRequest extends Request {
  usuario?: TokenPayload;
}

export const autenticar = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ ok: false, mensaje: 'Token no proporcionado' });
  }
  try {
    const token = header.split(' ')[1];
    req.usuario = verificarToken(token);
    next();
  } catch {
    return res.status(401).json({ ok: false, mensaje: 'Token invalido o expirado' });
  }
};

export const autorizar = (...roles: Rol[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.usuario || !roles.includes(req.usuario.rol_login as Rol)) {
      return res.status(403).json({ ok: false, mensaje: 'No tiene permisos para esta accion' });
    }
    next();
  };
};
