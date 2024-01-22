// Esta carpeta contiene los enrutadores de la aplicación. Los enrutadores se utilizan para mapear las URL a los controladores.
import { Router } from 'express';

import {
    registro,
    confirmEmail,
    perfil,
    listarpasajeros,
    actualizarPerfil,
    actualizarPassword,
    recuperarPassword,
    comprobarTokenPassword,
    nuevoPassword,
    asignarConductor,
    verViajesPendientes,
    obtenerAsientosDisponibles,
} from '../controllers/admin_controllers.js'

// RUTAS Y HORARIOS
import {
    registrarRutaHorario,
    obtenerRutasHorarios,
    actualizarRutaHorario,
    eliminarRutaHorario,
    obtenerRutaHorarioPorId
} from '../controllers/rutas_horarios_admin.js'

// Para las validaciones de datos
import {
    validacionConductor,
    validacionRutaHorario,
    validacionServicio,
}  from "../middlewares/validacionRP.js";


// Para que el ADMIN pueda gestionar a los conductores
import{
    registrarChofer,
    listarChoferes,
    obtenerChoferPorId,
    eliminarChoferPorId,
    actualizarChoferAdmin
} from '../controllers/adminConductor_controller.js'


// Para la gestion de VIAJES COMPARTIDOS
import{
    viajesPendientesCompartidos,
    viajeCompartidoId,
    eliminarBoletoCompId,
    actualizarBoletoC,
} from '../controllers/adminViajesC_controller.js'


// PARA LA GESTION DE VIAJES PRIVADOS
import{
    viajesPendientesPrivado,
    viajePrivadoId,
    eliminarBoletoPrivId,
    actualizarBoletoP,
    asignarPrivado
} from '../controllers/adminViajesP_controller.js';


// PARA LA GESTION DE ENCOMIENDAS
import{
    encomiendasPendientes,
    encomiendaId,
    actualizarEncomienda,
    eliminarEncomiendaId,
    asignarEncomienda
} from '../controllers/adminViajesE_controller.js';

import {registrarServicio} from '../controllers/servicio_controllers.js'

import verificarAutenticacion from '../middlewares/autenticacion.js'


const router =  Router();


//REGISTRO
router.post("/admin/register", registro);

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
router.put("/admin/actualizar/:id", verificarAutenticacion, actualizarPerfil);

// LISTAR CHOFERES Y PASASJEROS REGISTRADOS
//router.get("/admin/lista-choferes",verificarAutenticacion, listarChoferes);
router.get("/admin/lista-pasajeros", listarpasajeros);

// REGISTRO DE SERVICIOS
router.post("/admin/registro-servicio", validacionServicio, verificarAutenticacion, registrarServicio);

// ENDPOINTS DE RUTAS y HORARIOS
router.post("/admin/registro-ruta", validacionRutaHorario, verificarAutenticacion, registrarRutaHorario);
router.get("/admin/rutas",verificarAutenticacion, obtenerRutasHorarios);
router.put("/admin/actualizarRuta/:id", validacionRutaHorario, verificarAutenticacion, actualizarRutaHorario);
router.delete("/admin/eliminarRuta/:id", verificarAutenticacion, eliminarRutaHorario);
router.get("/admin/ruta/:id",verificarAutenticacion, obtenerRutaHorarioPorId);



//GESTION DE CONDUCTORES
router.post("/admin/registrar-chofer", validacionConductor, verificarAutenticacion, registrarChofer);
router.get("/admin/lista-conductores", verificarAutenticacion, listarChoferes);
router.get("/admin/conductor/:id",verificarAutenticacion, obtenerChoferPorId );
router.delete("/admin/eliminarConductor/:id", verificarAutenticacion, eliminarChoferPorId);
router.put("/admin/actualizarConductor/:id", validacionConductor, verificarAutenticacion, actualizarChoferAdmin );


// GESTION DE VIAJES COMPARTIDOS
router.get("/admin/viajesC", verificarAutenticacion, viajesPendientesCompartidos);
router.get("/admin/viajeC/:id", verificarAutenticacion, viajeCompartidoId);
router.delete("/admin/eliminarVC/:id", verificarAutenticacion, eliminarBoletoCompId);
router.put("/admin/actualizarVC/:id", verificarAutenticacion, actualizarBoletoC );


// GESTION DE VIAJES PRIVADOS
router.get("/admin/viajesPriv", verificarAutenticacion, viajesPendientesPrivado);
router.get("/admin/viajePriv/:id", verificarAutenticacion, viajePrivadoId);
router.delete("/admin/eliminarPriv/:id", verificarAutenticacion, eliminarBoletoPrivId);
router.put("/admin/actualizarPriv/:id", verificarAutenticacion, actualizarBoletoP );
router.post("/admin/asignar-conductorPriv", verificarAutenticacion, asignarPrivado );

// GESTION DE VIAJES PRIVADOS
router.get("/admin/encomiendas", verificarAutenticacion, encomiendasPendientes);
router.get("/admin/encomienda/:id", verificarAutenticacion, encomiendaId);
router.delete("/admin/eliminarEnco/:id", verificarAutenticacion, eliminarEncomiendaId);
router.put("/admin/actualizarEnco/:id", verificarAutenticacion, actualizarEncomienda );
router.post("/admin/asignar-conductorEnco", verificarAutenticacion, asignarEncomienda );


/*     encomiendasPendientes,
    encomiendaId,
    actualizarEncomienda,
    eliminarEncomiendaId,
 */

// VER VIAJES PENDIENTES
router.get("/admin/viajes-pendientes",verificarAutenticacion, verViajesPendientes);

// PARA LA ASIGNACION DE UN VIAJE A UN CONDUCTOR
router.post("/admin/asignar-conductor", verificarAutenticacion, asignarConductor );


// VER ASIENTOS DISPONIBLES
router.post("/admin/asientos-disponibles", verificarAutenticacion, obtenerAsientosDisponibles);





export default router;

