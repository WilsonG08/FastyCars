// Esta carpeta contiene los enrutadores de la aplicación. Los enrutadores se utilizan para mapear las URL a los controladores.

import { Router } from 'express';
import {
    login,
    perfil,
    registro,
    confirmcorreo,
    listarChoferes,
    listarPasajeros,
    detallePasajero,
    actualizarPerfil,
    actualizarPassword,
    recuperarPassword,
    comprobarTokenPassword,
    nuevoPassword
} from '../controllers/pasajero_controllers.js'
import verificarAutenticacion from '../middlewares/autenticacion.js'


const router =  Router()


router.post("/login", login);
router.post("/register", registro);
router.get("/confirmar/:token", confirmcorreo);
router.post("/recuperar-password", recuperarPassword);
router.get("/recuperar-password/:token", comprobarTokenPassword);
router.post("/nuevo-password/:token", nuevoPassword);
router.put("/pasajero/actualizarpassword", verificarAutenticacion, actualizarPassword);
router.get("/perfil", verificarAutenticacion, perfil);





// DUDA AQUI, QUIERO LISTAR LOS CHOFERES
router.get("/pasajeros", listarPasajeros);
router.get("/pasajeros/chofer", listarChoferes);

router.get("/pasajero/:id", verificarAutenticacion, detallePasajero);
router.put("/pasajero/:id", verificarAutenticacion, actualizarPerfil);

export default router;

