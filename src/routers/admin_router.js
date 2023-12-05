// Esta carpeta contiene los enrutadores de la aplicación. Los enrutadores se utilizan para mapear las URL a los controladores.

import { Router } from 'express';
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
import verificarAutenticacion from '../middlewares/autenticacion.js'

import {
    registrarRuta,
    obtenerRutas,
    actualizarRuta,
    eliminarRuta,
    registrarHorario,
    actualizarHorario,
    obtenerHorarios,
    eliminarHorario
} from '../controllers/rutas_horarios_admin.js'


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


// ENDPOINTS DE RUTAS
router.post("/admin/registro-ruta", verificarAutenticacion, registrarRuta);
router.get("/admin/rutas",verificarAutenticacion, obtenerRutas);
router.put("/admin/actualizarRuta/:id", verificarAutenticacion, actualizarRuta);
router.delete("/admin/eliminarRuta/:id", verificarAutenticacion, eliminarRuta);

// ENDPOINTS DE HORARIOS
router.post("/admin/registro-horario", verificarAutenticacion, registrarHorario);
router.get("/admin/horarios",verificarAutenticacion, obtenerHorarios);
router.put("/admin/actualizarHorario/:id", verificarAutenticacion, actualizarHorario);
router.delete("/admin/eliminarHorario/:id", verificarAutenticacion, eliminarHorario);



export default router;

