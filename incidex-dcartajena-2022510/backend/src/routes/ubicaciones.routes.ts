import { Router } from 'express';
import {
  listarUbicaciones,
  crearUbicacion,
  actualizarUbicacion,
  eliminarUbicacion,
} from '../controllers/ubicaciones.controller';
import { autenticar, autorizar } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = Router();

router.use(autenticar);
router.get('/', asyncHandler(listarUbicaciones));
router.post('/', autorizar('Administrador'), asyncHandler(crearUbicacion));
router.put('/:id', autorizar('Administrador'), asyncHandler(actualizarUbicacion));
router.delete('/:id', autorizar('Administrador'), asyncHandler(eliminarUbicacion));

export default router;