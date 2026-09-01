import mysql from 'mysql2/promise';
import 'dotenv/config';

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'IN5CM',
  password: process.env.DB_PASSWORD || '?donmoA5m@',
  database: process.env.DB_NAME || 'DBgestionIncidencias_in5cm',
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true,
});

export const probarConexion = async () => {
  const conn = await pool.getConnection();
  await conn.ping();
  conn.release();
};