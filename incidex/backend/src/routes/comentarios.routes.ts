import { Router } from 'express';
import {
  listarComentarios,
  crearComentario,
  actualizarComentario,
  eliminarComentario,
} from '../controllers/comentarios.controller';
import { autenticar } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = Router();

router.use(autenticar);
router.get('/', asyncHandler(listarComentarios));
router.post('/', asyncHandler(crearComentario));
router.put('/:id', asyncHandler(actualizarComentario));
router.delete('/:id', asyncHandler(eliminarComentario));

export default router;
