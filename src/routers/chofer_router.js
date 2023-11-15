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
router.get("/chofer/confirmar/:token", confirmEmail);


// aqui falta el perfil del chofer
// acrualizar datos del chofer



// Probar lo que me sirve
router.get("/chofer/:id", verificarAutentificacion, detalleChofer);
router.put("/chofer", verificarAutentificacion, actualizarChofer);
router.delete("/chofer/eliminar/:id", verificarAutentificacion, eliminarChofer);
router.get("/chofer", verificarAutentificacion, listarchoferes);




export default router;
