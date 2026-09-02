import { Router } from 'express';
import {
  listarDepartamentos,
  crearDepartamento,
  actualizarDepartamento,
  eliminarDepartamento,
} from '../controllers/departamentos.controller';
import { autenticar, autorizar } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = Router();

router.use(autenticar);
router.get('/', asyncHandler(listarDepartamentos));
router.post('/', autorizar('Administrador'), asyncHandler(crearDepartamento));
router.put('/:id', autorizar('Administrador'), asyncHandler(actualizarDepartamento));
router.delete('/:id', autorizar('Administrador'), asyncHandler(eliminarDepartamento));

export default router;
