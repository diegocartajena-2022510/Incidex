import { Router } from 'express';
import { iniciarSesion, perfilActual } from '../controllers/auth.controller';
import { autenticar } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = Router();

router.post('/login', asyncHandler(iniciarSesion));
router.get('/perfil', autenticar, asyncHandler(perfilActual));

export default router;
