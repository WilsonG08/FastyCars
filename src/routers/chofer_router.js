import { Router } from "express"
import {
    listarchoferes,
    detalleChofer,
    actualizarChofer,
    eliminarChofer,
    confirmEmail
} from "../controllers/chofer_controllers.js"

import verificarAutentificacion from "../middlewares/autenticacion.js";

const router = Router();


// CONFIRMAR CORREO
router.get("/chofer/confirmar/:token", confirmEmail);


router.put("/chofer", verificarAutentificacion, actualizarChofer);
router.delete("/chofer/eliminar/:id", verificarAutentificacion, eliminarChofer);



// ME PUEDE SERVIR PARA LISTAR LOS CLIENTES
router.get("/chofer", verificarAutentificacion, listarchoferes);
router.get("/chofer/:id", verificarAutentificacion, detalleChofer);


export default router;
