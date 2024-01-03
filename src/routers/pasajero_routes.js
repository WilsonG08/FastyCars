// Esta carpeta contiene los enrutadores de la aplicación. Los enrutadores se utilizan para mapear las URL a los controladores.

import { Router } from 'express';
import {
    login,
    perfil,
    registro,
    confirmEmail,
    detallePasajero,
    actualizarPerfil,
    actualizarPassword,
    recuperarPassword,
    comprobarTokenPassword,
    nuevoPassword,
    serviciosDsiponibles,
    obtenerRutasHorarios,
    verConductorAsignado
} from '../controllers/pasajero_controllers.js'
import verificarAutenticacion from '../middlewares/autenticacion.js'

import { 
    realizarReserva,
    listarReservasCliente,
    actualizarBoletoCliente,
    eliminarReservaCliente
} from '../controllers/reserva_boleto_controllers.js';

// PARA EL VIAJE PRIVADO
import {
    realizarReservaPriv,
    listarBoletosPriv,
} from '../controllers/reservaPrivado_controllers.js';


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

// VISUALIZAR SERVIVIOS DISPONIBLES
//router.get("/servicios", verificarAutenticacion, "");


// RESERVAR BOLETO
router.post("/reserva-boleto", verificarAutenticacion, realizarReserva);
router.get("/listar-reserva", verificarAutenticacion, listarReservasCliente);
router.put("/actualizar-boleto/:id", verificarAutenticacion, actualizarBoletoCliente);
router.delete("/eliminar-boleto/:id", verificarAutenticacion, eliminarReservaCliente);


// OBTENER LAS RUTAS Y HORARIOS
router.get("/rutas",verificarAutenticacion, obtenerRutasHorarios);

//OBTENER LOS SERVICIOS DISPONIBLES
router.get("/servicios",verificarAutenticacion, serviciosDsiponibles);


// VER EL CONDUCTOR
router.get("/admin/ver-conductor", verificarAutenticacion, verConductorAsignado);


// VIAJE PRIVADO
router.post("/reserva-boleto-privado", verificarAutenticacion, realizarReservaPriv);
router.get("/listar-boletos-privados", verificarAutenticacion, listarBoletosPriv);




// AUN ME FALTA VER
// DUDA AQUI, QUIERO LISTAR LOS CHOFERES
//router.get("/pasajeros", listarPasajeros);
//router.get("/pasajeros/chofer", listarChoferes);

router.get("/pasajero/:id", verificarAutenticacion, detallePasajero);
router.put("/pasajero/:id", verificarAutenticacion, actualizarPerfil);

export default router;

