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
    verConductorAsignado,
    actualizarPerfilPasajero
} from '../controllers/pasajero_controllers.js'
import verificarAutenticacion from '../middlewares/autenticacion.js'

// Viaje compartido
import { 
    realizarReserva,
    listarReservasCliente,
    actualizarBoletoCliente,
    eliminarReservaCliente
} from '../controllers/reserva_boleto_controllers.js';


// PARA EL VIAJE PRIVADO
import {
    reservaBoletoPriv,
    actualizarBoletoPriv,
} from '../controllers/reservaPrivado_controllers.js';


// ENCOMIENDA
import {
    reservaEncomienda,
    actualizarEncomienda,
} from '../controllers/reserva_encomienda_controllers.js';

import {validacionBoleto, validacionBoletoAc} from '../middlewares/validacionRP.js'

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

// ACTUALIZAR PERFIL
router.put("/pasajero/actualizarPerfil/:id", verificarAutenticacion, actualizarPerfilPasajero);


// VISUALIZAR SERVIVIOS DISPONIBLES
//router.get("/servicios", verificarAutenticacion, "");


// RESERVAR BOLETO
router.post("/reserva-boleto", validacionBoleto, verificarAutenticacion, realizarReserva);
router.get("/listar-reserva/:id", verificarAutenticacion, listarReservasCliente);
router.put("/actualizar-boleto/:id",validacionBoletoAc, verificarAutenticacion, actualizarBoletoCliente);
router.delete("/eliminar-boleto/:id", verificarAutenticacion, eliminarReservaCliente);

// VIAJE PRIVADO
router.post("/reserva-boleto-privado", validacionBoleto, verificarAutenticacion, reservaBoletoPriv);
router.put("/actualizar-boleto-privado/:id", validacionBoletoAc, verificarAutenticacion, actualizarBoletoPriv);


// RESERVA ENCOMIENDA
router.post("/reserva-encomienda", verificarAutenticacion, reservaEncomienda);
router.put("/encomienda-actualizar/:id", verificarAutenticacion, actualizarEncomienda);



// OBTENER LAS RUTAS Y HORARIOS
router.get("/rutas",verificarAutenticacion, obtenerRutasHorarios);

//OBTENER LOS SERVICIOS DISPONIBLES
router.get("/servicios",verificarAutenticacion, serviciosDsiponibles);


// VER EL CONDUCTOR
router.get("/admin/ver-conductor", verificarAutenticacion, verConductorAsignado);


// AUN ME FALTA VER
// DUDA AQUI, QUIERO LISTAR LOS CHOFERES
//router.get("/pasajeros", listarPasajeros);
//router.get("/pasajeros/chofer", listarChoferes);

router.get("/pasajero/:id", verificarAutenticacion, detallePasajero);
router.put("/pasajero/:id", verificarAutenticacion, actualizarPerfil);

export default router;

