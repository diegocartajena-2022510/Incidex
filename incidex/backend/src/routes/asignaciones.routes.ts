import { Router } from 'express';
import {
  listarAsignaciones,
  crearAsignacion,
  actualizarAsignacion,
  eliminarAsignacion,
} from '../controllers/asignaciones.controller';
import { autenticar, autorizar } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = Router();

router.use(autenticar);
router.get('/', asyncHandler(listarAsignaciones));
router.post('/', autorizar('Administrador'), asyncHandler(crearAsignacion));
router.put('/:id', autorizar('Administrador'), asyncHandler(actualizarAsignacion));
router.delete('/:id', autorizar('Administrador'), asyncHandler(eliminarAsignacion));

export default router;
