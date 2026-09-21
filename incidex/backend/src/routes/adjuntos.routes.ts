import { Router } from 'express';
import { listarAdjuntos, crearAdjunto, eliminarAdjunto } from '../controllers/adjuntos.controller';
import { autenticar } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/asyncHandler';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

router.use(autenticar);
router.get('/', asyncHandler(listarAdjuntos));
router.post('/', upload.single('archivo'), asyncHandler(crearAdjunto));
router.delete('/:id', asyncHandler(eliminarAdjunto));

export default router;
