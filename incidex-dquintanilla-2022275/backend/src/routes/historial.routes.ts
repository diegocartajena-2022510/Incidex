import { Router } from 'express';
import { listarHistorial, eliminarHistorial } from '../controllers/historial.controller';
import { autenticar, autorizar } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = Router();

router.use(autenticar);
router.get('/', asyncHandler(listarHistorial));
router.delete('/:id', autorizar('Administrador'), asyncHandler(eliminarHistorial));

export default router;
