import { Router } from "express"
import {
    listarchoferes,
    detalleChofer,
    loginChofer,
    actualizarChofer,
    eliminarChofer,
    confirmEmail
} from "../controllers/chofer_controllers.js"

import verificarAutentificacion from "../middlewares/autenticacion.js";

const router = Router();

router.post("/chofer/login", loginChofer);

router.get("/chofer", verificarAutentificacion, listarchoferes);
router.get("/chofer/:id", verificarAutentificacion, detalleChofer);
//router.post("/chofer/registro", verificarAutentificacion, registrarChofer);
router.put("/chofer", verificarAutentificacion, actualizarChofer);
router.delete("/chofer/eliminar/:id", verificarAutentificacion, eliminarChofer);
router.get("/chofer/confirmar/:token", confirmEmail);

export default router;


