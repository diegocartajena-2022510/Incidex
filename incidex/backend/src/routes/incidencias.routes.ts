import { Router } from 'express';
import {
  listarIncidencias,
  obtenerIncidencia,
  crearIncidencia,
  actualizarIncidencia,
  eliminarIncidencia,
} from '../controllers/incidencias.controller';
import { autenticar, autorizar } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = Router();

router.use(autenticar);
router.get('/', asyncHandler(listarIncidencias));
router.get('/:id', asyncHandler(obtenerIncidencia));
router.post('/', asyncHandler(crearIncidencia));
router.put('/:id', asyncHandler(actualizarIncidencia));
router.delete('/:id', autorizar('Administrador'), asyncHandler(eliminarIncidencia));

export default router;
