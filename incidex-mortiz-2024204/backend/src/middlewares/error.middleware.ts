import { Request, Response, NextFunction } from 'express';

export const manejarErrores = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  const mensaje = err?.sqlMessage || err?.message || 'Error interno del servidor';
  res.status(err?.status || 500).json({ ok: false, mensaje });
};

export const rutaNoEncontrada = (_req: Request, res: Response) => {
  res.status(404).json({ ok: false, mensaje: 'Recurso no encontrado' });
};
