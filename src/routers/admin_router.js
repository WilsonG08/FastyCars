// Esta carpeta contiene los enrutadores de la aplicación. Los enrutadores se utilizan para mapear las URL a los controladores.
import { Router } from 'express';
import verificarAutenticacion from '../middlewares/autenticacion.js'

import {
    registro,
    confirmEmail,
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

import {
    registrarRutaHorario,
    obtenerRutasHorarios,
    actualizarRutaHorario,
    eliminarRutaHorario
} from '../controllers/rutas_horarios_admin.js'

import {registrarServicio} from '../controllers/servicio_controllers.js'


const router =  Router()


//REGISTRO
router.post("/admin/register", registro);
router.post("/admin/registrar-chofer", verificarAutenticacion, registrarChofer);

// CONFIRMAR CORREO
router.get("/admin/confirmar/:token", confirmEmail);

// RECUPERAR CONTRASEÑA
router.post("/admin/recuperar-password", recuperarPassword);
router.get("/admin/recuperar-password/:token", comprobarTokenPassword);

// ACTUALIZAR CONTRASEÑA
router.post("/admin/nuevo-password/:token", nuevoPassword);
router.put("/admin/actualizarpassword", verificarAutenticacion, actualizarPassword);

// VIZUALIZAR PERFIL
router.get("/admin/perfil", verificarAutenticacion, perfil);

// ACTUALIZAR PERFIL
router.put("/admin/actualizar", verificarAutenticacion, actualizarPerfil);

// LISTAR CHOFERES Y PASASJEROS REGISTRADOS
router.get("/admin/lista-choferes",verificarAutenticacion, listarChoferes);
router.get("/admin/lista-pasajeros", listarpasajeros);

// REGISTRO DE SERVICIOS
router.post("/admin/registro-servicio", verificarAutenticacion, registrarServicio);


// ENDPOINTS DE RUTAS y HORARIOS
router.post("/admin/registro-ruta", verificarAutenticacion, registrarRutaHorario);
router.get("/admin/rutas",verificarAutenticacion, obtenerRutasHorarios);
router.put("/admin/actualizarRuta/:id", verificarAutenticacion, actualizarRutaHorario);
router.delete("/admin/eliminarRuta/:id", verificarAutenticacion, eliminarRutaHorario);


export default router;

