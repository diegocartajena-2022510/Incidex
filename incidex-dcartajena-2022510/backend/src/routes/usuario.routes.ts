import { Router } from 'express';
import {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
} from '../controllers/usuarios.controller';
import { autenticar, autorizar } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/asyncHandler';


const router = Router();
router.use(autenticar);
router.get('/', autorizar('Administrador'), asyncHandler(listarUsuarios));
router.post('/', autorizar('Administrador'), asyncHandler(crearUsuario));
router.put('/:id', autorizar('Administrador'), asyncHandler(actualizarUsuario));
router.delete('/:id', autorizar('Administrador'), asyncHandler(eliminarUsuario));

export default router;