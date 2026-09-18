import { Router } from 'express';
import { listarNotificaciones, marcarLeida, marcarTodasLeidas } from '../controllers/notificaciones.controller';
import { autenticar } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = Router();

router.use(autenticar);
router.get('/', asyncHandler(listarNotificaciones));
router.put('/leer-todas', asyncHandler(marcarTodasLeidas));
router.put('/:id/leer', asyncHandler(marcarLeida));

export default router;
