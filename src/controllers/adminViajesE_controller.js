/* import Administrador from "../models/adminDB.js";
import Pasajero from '../models/pasajeroDB.js'
import generarJWT from "../helpers/crearJWT.js";
import Boleto from '../models/reservaDB.js'
*/

import Conductor from "../models/conductorDB.js";
import Encomienda from '../models/encomiendaDb.js';
import mongoose from "mongoose";

// LISTA TODAS LAS ENCOMIENDAS PENDIENTES
const encomiendasPendientes = async (req, res) => {

    if (req.rol !== 'administrador') {
        return res.status(403).json({ msg: 'Acceso denegado. Solo los usuarios con rol de Administrador tienen permiso para esta operación.' });
    }

    try {
        // Obtener las encomiendas que no tienen conductor asignado y cuyo estado es 'Pendiente'
        const encomiendas = await Encomienda.find({ conductorAsignado: null, estadoPaquete: 'Pendiente' });

        // Verificar si se encontraron encomiendas
        if (encomiendas.length > 0) {
            // Crear un nuevo array de encomiendas con solo los detalles que necesitas
            const encomiendasFiltradas = encomiendas.map(encomienda => ({
                tipoEncomienda: encomienda.tipoBoleto,
                nombreRemitente: encomienda.remitente.nombre,
                apellidoRemitente: encomienda.remitente.apellido,
                ciudadSalida: encomienda.ciudadRemitente.ciudad,
                ciudadLlegada: encomienda.ciudadDestinatario.ciudad,
                turno: encomienda.turno,
                id: encomienda._id,
                numPaquetes: encomienda.numPaquetes
            }));

            // Enviar respuesta con las encomiendas pendientes
            res.status(200).json({ mensaje: 'Encomiendas Pendientes', encomiendas: encomiendasFiltradas });
        } else {
            // Enviar respuesta de error si no se encontraron encomiendas
            res.status(400).json({ error: 'No se encontraron encomiendas pendientes' });
        }
    } catch (error) {
        // Manejar errores
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



// LISTA UNA ENCOMIENDA PENDIENTE
const encomiendaId = async (req, res) => {
    const id = req.params.id; // Obtener el ID del parámetro de la ruta

    if (req.rol !== 'administrador') {
        return res.status(403).json({ msg: 'Acceso denegado. Solo los usuarios con rol de Administrador tienen permiso para esta operación.' });
    }

    try {
        // Buscar la encomienda con el ID proporcionado
        const encomienda = await Encomienda.findById(id);

        // Verificar si se encontró la encomienda
        if (encomienda) {
            // Crear un objeto con solo los detalles que necesitas
            const encomiendaFiltrada = {
                tipoEncomienda: encomienda.tipoBoleto,
                nombreRemitente: encomienda.remitente.nombre,
                apellidoRemitente: encomienda.remitente.apellido,
                ciudadSalida: encomienda.ciudadRemitente.ciudad,
                ciudadLlegada: encomienda.ciudadDestinatario.ciudad,
                turno: encomienda.turno,
                id: encomienda._id,
                numPaquetes: encomienda.numPaquetes
            };

            // Enviar respuesta con la encomienda
            res.status(200).json({ mensaje: 'Encomienda', encomienda: encomiendaFiltrada });
        } else {
            // Enviar respuesta de error si no se encontró la encomienda
            res.status(400).json({ error: 'No se encontró la encomienda pendiente con el ID proporcionado' });
        }
    } catch (error) {
        // Manejar errores
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



// ACTUALIZA SOLO EL ESTADO Y ASIGNACION DE UN CONDUCTOR 
const actualizarEncomienda = async (req, res) => {
    const idEncomienda = req.params.id; // Obtener el ID del parámetro de la ruta

    // Solo tomar en cuenta los campos 'conductorAsignado' y 'estadoPaquete' del cuerpo de la solicitud
    const datosActualizados = {
        conductorAsignado: req.body.conductorAsignado,
        estadoPaquete: req.body.estadoPaquete
    };

    if (req.rol !== 'administrador') {
        return res.status(403).json({ msg: 'Acceso denegado. Solo los usuarios con rol de Administrador tienen permiso para esta operación.' });
    }

    try {
        // Obtener la encomienda actual
        const encomiendaActual = await Encomienda.findById(idEncomienda);

        // Verificar si la encomienda existe
        if (!encomiendaActual) {
            return res.status(400).json({ error: 'No se encontró la encomienda con el ID proporcionado' });
        }

        // Verificar el estado actual de la encomienda
        if (encomiendaActual.estadoPaquete !== 'Pendiente' && encomiendaActual.estadoPaquete !== 'Aprobado') {
            return res.status(400).json({ error: 'Solo se puede actualizar el estado de la encomienda cuando está en estado Pendiente o Aprobado' });
        }

        // Actualizar la encomienda con el ID proporcionado
        const encomiendaActualizada = await Encomienda.findByIdAndUpdate(idEncomienda, datosActualizados, { new: true });

        // Enviar respuesta con los detalles de la encomienda actualizada
        res.status(200).json(encomiendaActualizada);
    } catch (error) {
        // Manejar errores
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}




// Eliminar la encomienda
const eliminarEncomiendaId = async (req, res) => {
    const idEncomienda = req.params.id; // Obtener el ID del parámetro de la ruta

    if (req.rol !== 'administrador') {
        return res.status(403).json({ msg: 'Acceso denegado. Solo los usuarios con rol de Administrador tienen permiso para esta operación.' });
    }

    try {
        // Eliminar la encomienda con el ID proporcionado
        const encomiendaEliminada = await Encomienda.findByIdAndDelete(idEncomienda);

        // Verificar si se eliminó la encomienda
        if (encomiendaEliminada) {
            // Enviar respuesta de éxito
            res.status(200).json({ mensaje: 'Encomienda eliminada exitosamente' });
        } else {
            // Enviar respuesta de error si no se encontró la encomienda
            res.status(400).json({ error: 'No se encontró la encomienda con el ID proporcionado' });
        }
    } catch (error) {
        // Manejar errores
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



// Asignar la encomienda a un conductor
const asignarEncomienda = async (req, res) => {
    try {
        const { idEncomienda, idConductor } = req.body;

        // Validar si idEncomienda es una cadena válida ObjectId
        if (!mongoose.Types.ObjectId.isValid(idEncomienda)) {
            return res.status(400).json({ error: 'ID de encomienda no válido' });
        }

        // Convertir la cadena a ObjectId
        const encomiendaObjectId = new mongoose.Types.ObjectId(idEncomienda);

        // Obtener la encomienda y el conductor
        const encomienda = await Encomienda.findById(encomiendaObjectId);
        const conductor = await Conductor.findById(idConductor);

        // Verificar si la encomienda y el conductor son válidos
        if (!encomienda) {
            return res.status(400).json({ error: 'La encomienda no existe' });
        } else if (!conductor) {
            return res.status(400).json({ error: 'El conductor no existe' });
        } else {
            // Verificar si el campo conductorAsignado de la encomienda está vacío
            if (!encomienda.conductorAsignado) {
                // Actualizar la encomienda con el conductor asignado
                encomienda.conductorAsignado = conductor._id;
                await encomienda.save();

                // Enviar respuesta exitosa
                res.status(200).json({
                    mensaje: 'Conductor asignado con éxito',
                    nombreConductor: conductor.conductorNombre + ' ' + conductor.conductorApellido,
                });
            } else {
                // Enviar respuesta de error si el campo conductorAsignado de la encomienda no está vacío
                res.status(400).json({ error: 'La encomienda ya tiene un conductor asignado' });
            }
        }
    } catch (error) {
        // Manejar errores
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};






export {
    encomiendasPendientes,
    encomiendaId,
    actualizarEncomienda,
    eliminarEncomiendaId,
    asignarEncomienda
}