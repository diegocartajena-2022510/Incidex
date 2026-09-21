import express from 'express';
import cors from 'cors';
import path from 'path';
import 'dotenv/config';
import rutas from './routes';
import { manejarErrores, rutaNoEncontrada } from './middlewares/error.middleware';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, mensaje: 'API Incidex funcionando correctamente' });
});

app.use('/api', rutas);

app.use(rutaNoEncontrada);
app.use(manejarErrores);

export default app;
