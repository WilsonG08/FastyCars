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
import verificarAutenticacion from '../middlewares/autenticacion.js'


const router =  Router()

// REGISTRO
router.post("/register", registro);

// LOGIN DE LOS 3 PERFILES
router.post("/login", login);

// CONFIRMAR CORREO
router.get("/confirmar/:token", confirmEmail);

// RECUPERAR CONTRASEÑA
router.post("/recuperar-password", recuperarPassword);
router.get("/recuperar-password/:token", comprobarTokenPassword);

// ACTUALIZAR CONTRASEÑA
router.post("/nuevo-password/:token", nuevoPassword);
router.put("/pasajero/actualizarpassword", verificarAutenticacion, actualizarPassword);

// VISUALIZAR PERFIL
router.get("/perfil", verificarAutenticacion, perfil);



// AUN ME FALTA VER
// DUDA AQUI, QUIERO LISTAR LOS CHOFERES
router.get("/pasajeros", listarPasajeros);
router.get("/pasajeros/chofer", listarChoferes);

router.get("/pasajero/:id", verificarAutenticacion, detallePasajero);
router.put("/pasajero/:id", verificarAutenticacion, actualizarPerfil);

export default router;

