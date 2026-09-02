import { Response } from 'express';

export const ok = (res: Response, data: any = null, mensaje = 'Operacion exitosa', status = 200) =>
  res.status(status).json({ ok: true, mensaje, data });

export const error = (res: Response, mensaje = 'Ocurrio un error', status = 400) =>
  res.status(status).json({ ok: false, mensaje });
