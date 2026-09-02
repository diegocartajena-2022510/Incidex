import { Router } from 'express';
import {
  listarCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from '../controllers/categorias.controller';
import { autenticar, autorizar } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = Router();

router.use(autenticar);
router.get('/', asyncHandler(listarCategorias));
router.post('/', autorizar('Administrador'), asyncHandler(crearCategoria));
router.put('/:id', autorizar('Administrador'), asyncHandler(actualizarCategoria));
router.delete('/:id', autorizar('Administrador'), asyncHandler(eliminarCategoria));

export default router;
