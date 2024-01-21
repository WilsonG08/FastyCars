import { Router } from "express"
import verificarAutenticacion from '../middlewares/autenticacion.js'


import {
    actualizarChofer,
    eliminarChofer,
    confirmEmail,
    actualizarPassword,
    recuperarPassword,
    comprobarTokenPassword,
    nuevoPassword,
    verViajesAsignados,
    actualizarEstadoCompartido,
    detalleChofer
} from "../controllers/chofer_controllers.js"

import verificarAutentificacion from "../middlewares/autenticacion.js";

const router = Router();


// CONFIRMAR CORREO
router.get("/chofer/confirmar/:token", confirmEmail);

// VER INFORMACION PERFIL
router.get("/conductor/:id", verificarAutentificacion, detalleChofer);

// RECUPERAR CONTRASEÑA
router.post("/conductor/recuperar-password", recuperarPassword);
router.get("/conductor/recuperar-password/:token", comprobarTokenPassword);
router.post("/conductor/nuevo-password/:token", nuevoPassword);

// ACTUALIZAR CONTRASEÑA
router.put("/conductor/actualizarpassword", verificarAutenticacion, actualizarPassword);



router.put("/chofer/actualizarPerfil/:id", verificarAutentificacion, actualizarChofer);
router.delete("/chofer/eliminar/:id", verificarAutentificacion, eliminarChofer);

// VER VIAJES ASIGNADO
router.get("/chofer/viajes-asigandos",verificarAutenticacion, verViajesAsignados);


// CAMBIAR EL ESTADO DE UN PASAJERO
router.put("/chofer/actualizarECom", verificarAutentificacion, actualizarEstadoCompartido);




// ME PUEDE SERVIR PARA LISTAR LOS CLIENTES
// router.get("/chofer", verificarAutentificacion, listarchoferes);






export default router;
