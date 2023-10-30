// Esta carpeta contiene los enrutadores de la aplicación. Los enrutadores se utilizan para mapear las URL a los controladores.

import { Router } from 'express';
import {
    login,
    perfil,
    registro,
    confirmEmail,
    listarChoferes,
    listarPasajeros,
    detallePasajero,
    actualizarPerfil,
    actualizarPassword,
    recuperarPassword,
    comprobarTokenPassword,
    nuevoPassword
} from '../controllers/pasajero_controllers.js'
import verificarAutenticacion from '../middlewares/autenticacion_Pasajero.js'


const router =  Router()


router.post("/login", login);
router.post("/registro", registro);
router.get("/confirmar/:token", confirmEmail);
router.get("/pasajeros", listarPasajeros);
// DUDA AQUI, QUIERO LISTAR LOS CHOFERES
router.get("/pasajeros/chofer", listarChoferes);
router.post("/recuperar-password", recuperarPassword);
router.get("/recuperar-password/:token", comprobarTokenPassword);
router.post("/nuevo-password/:token", nuevoPassword);


router.get("/perfil", verificarAutenticacion, perfil);
router.put("/pasajero/actualizarpassword", verificarAutenticacion, actualizarPassword);
router.get("/pasajero/:id", verificarAutenticacion, detallePasajero);
router.put("/pasajero/:id", verificarAutenticacion, actualizarPerfil);

export default router;


