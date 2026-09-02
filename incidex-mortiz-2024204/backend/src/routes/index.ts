import { Router } from 'express';
import authRoutes from './auth.routes';
import departamentosRoutes from './departamentos.routes';
import categoriasRoutes from './categorias.routes';
import ubicacionesRoutes from './ubicaciones.routes';
import prioridadesRoutes from './prioridades.routes';
import usuariosRoutes from './usuarios.routes';
import incidenciasRoutes from './incidencias.routes';
import asignacionesRoutes from './asignaciones.routes';
import historialRoutes from './historial.routes';
import comentariosRoutes from './comentarios.routes';
import adjuntosRoutes from './adjuntos.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/departamentos', departamentosRoutes);
router.use('/categorias', categoriasRoutes);
router.use('/ubicaciones', ubicacionesRoutes);
router.use('/prioridades', prioridadesRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/incidencias', incidenciasRoutes);
router.use('/asignaciones', asignacionesRoutes);
router.use('/historial', historialRoutes);
router.use('/comentarios', comentariosRoutes);
router.use('/adjuntos', adjuntosRoutes);

export default router;
