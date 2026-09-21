import { Pool } from 'pg';
import 'dotenv/config';

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'dbgestionincidencias_postgresql',
  max: 10,
});

export const probarConexion = async () => {
  const cliente = await pool.connect();
  await cliente.query('SELECT 1');
  cliente.release();
};