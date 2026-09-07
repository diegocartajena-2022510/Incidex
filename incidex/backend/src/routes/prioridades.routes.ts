import { Router } from 'express';
import {
  listarPrioridades,
  crearPrioridad,
  actualizarPrioridad,
  eliminarPrioridad,
} from '../controllers/prioridades.controller';
import { autenticar, autorizar } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = Router();

router.use(autenticar);
router.get('/', asyncHandler(listarPrioridades));
router.post('/', autorizar('Administrador'), asyncHandler(crearPrioridad));
router.put('/:id', autorizar('Administrador'), asyncHandler(actualizarPrioridad));
router.delete('/:id', autorizar('Administrador'), asyncHandler(eliminarPrioridad));

export default router;
