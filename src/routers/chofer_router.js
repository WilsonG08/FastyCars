import { Router } from "express"
import {
    login,
    perfil,
    confirmEmail,
    listarPasajeros,
    detallePasajero,
    actualizarPerfil,
    actualizarPassword,
    recuperarPassword,
    comprobarTokenPassword,
    nuevoPassword
} from "../controllers/chofer_controllers.js"

import verificarAutentificacion from "../middlewares/autenticacion.js";

const router = Router();

router.post("/chofer/login", login);
router.get("/chofer", verificarAutentificacion, listarPasajeros);
router.get("/chofer/:id", verificarAutentificacion, detallePasajero);
//router.post("/chofer/registro", verificarAutentificacion, registrarChofer);
router.put("/chofer", verificarAutentificacion, actualizarPerfil);
//router.delete("/chofer/eliminar/:id", verificarAutentificacion, eliminarChofer);
router.get("/chofer/confirmar/:token", confirmEmail);

export default router;


