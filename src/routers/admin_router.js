// Esta carpeta contiene los enrutadores de la aplicación. Los enrutadores se utilizan para mapear las URL a los controladores.

import { Router } from 'express';
import {
    registro,
    confirmEmail,
    login,
    perfil,
    listarChoferes,
    listarpasajeros,
    detalleChofer,
    detallePasjero,
    actualizarPerfil,
    actualizarPassword,
    recuperarPassword,
    comprobarTokenPassword,
    nuevoPassword,
    registrarChofer
} from '../controllers/admin_controllers.js'
import verificarAutenticacion from '../middlewares/autenticacion.js'


const router =  Router()


router.post("/admin/registro", registro);
router.post("/admin/login", login);
router.get("/admin/confirmar/:token", confirmEmail);

// BIEN
router.post("/admin/registrar-chofer", verificarAutenticacion, registrarChofer);
router.get("/admin/lista-choferes",verificarAutenticacion, listarChoferes);
router.get("/admin/lista-pasajeros", listarpasajeros);
router.post("/admin/recuperar-password", recuperarPassword);
router.get("/admin/recuperar-password/:token", comprobarTokenPassword);
router.post("/admin/nuevo-password/:token", nuevoPassword);
router.get("/admin/perfil", verificarAutenticacion, perfil);




// FALTA PROBAR
router.put("/admin/pasajero/actualizarpassword", verificarAutenticacion, actualizarPassword);
router.get("/admin/pasajero/:id", verificarAutenticacion, detallePasjero);
router.put("/admin/pasajero/:id", verificarAutenticacion, actualizarPerfil);

export default router;

