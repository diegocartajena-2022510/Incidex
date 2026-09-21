import 'dotenv/config';
import app from './app';
import { probarConexion } from './config/db';

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
  try {
    await probarConexion();
    console.log('Conexion a la base de datos establecida correctamente');
  } catch (err) {
    console.error('No se pudo conectar a la base de datos:', err);
  }

  app.listen(PORT, () => {
    console.log(`Servidor Incidex escuchando en http://localhost:${PORT}`);
  });
};

iniciarServidor();
