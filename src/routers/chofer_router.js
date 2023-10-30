import { Router } from "express"
import {
    listarchoferes,
    detalleChofer,
    registrarChofer,
    actualizarChofer,
    eliminarChofer
} from "../controllers/chofer_controllers.js"

import verificarAutentificacion from "../middlewares/autenticacion_Admin.js";

const router = Router();

router.get("/chofer", verificarAutentificacion, listarchoferes);
router.get("/chofer/:id", verificarAutentificacion, detalleChofer);
router.post("/chofer/registro", verificarAutentificacion, registrarChofer);
router.put("/chofer", verificarAutentificacion, actualizarChofer);
router.delete("/chofer/eliminar/:id", verificarAutentificacion, eliminarChofer)

export default router;


