import jwt from 'jsonwebtoken';
import 'dotenv/config';

const SECRET = process.env.JWT_SECRET || 'incidex_secret_key';

export interface TokenPayload {
  id_login: number;
  usuario_login: string;
  rol_login: string;
}

export const generarToken = (payload: TokenPayload): string =>
  jwt.sign(payload, SECRET, { expiresIn: '8h' });

export const verificarToken = (token: string): TokenPayload =>
  jwt.verify(token, SECRET) as TokenPayload;