import { Router } from "express"
import verificarAutenticacion from '../middlewares/autenticacion.js'

import {
    listarchoferes,
    detalleChofer,
    actualizarChofer,
    eliminarChofer,
    confirmEmail,
    actualizarPassword,
    recuperarPassword,
    comprobarTokenPassword,
    nuevoPassword
} from "../controllers/chofer_controllers.js"

import verificarAutentificacion from "../middlewares/autenticacion.js";

const router = Router();


// CONFIRMAR CORREO
router.get("/chofer/confirmar/:token", confirmEmail);

// RECUPERAR CONTRASEÑA
router.post("/conductor/recuperar-password", recuperarPassword);
router.get("/conductor/recuperar-password/:token", comprobarTokenPassword);

// ACTUALIZAR CONTRASEÑA
router.post("/conductor/nuevo-password/:token", nuevoPassword);
router.put("/conductor/actualizarpassword", verificarAutenticacion, actualizarPassword);



router.put("/chofer", verificarAutentificacion, actualizarChofer);
router.delete("/chofer/eliminar/:id", verificarAutentificacion, eliminarChofer);



// ME PUEDE SERVIR PARA LISTAR LOS CLIENTES
router.get("/chofer", verificarAutentificacion, listarchoferes);
router.get("/chofer/:id", verificarAutentificacion, detalleChofer);


export default router;
