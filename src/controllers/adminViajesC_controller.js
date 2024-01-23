/* import Administrador from "../models/adminDB.js";
import Pasajero from '../models/pasajeroDB.js'
import generarJWT from "../helpers/crearJWT.js";
 */

import Boleto from '../models/reservaDB.js'
import Conductor from "../models/conductorDB.js";
import mongoose from "mongoose";


// LISTA TODOS LOS VIAJES PENDIENTES
const viajesPendientesCompartidos = async (req, res) => {

    if (req.rol !== 'administrador') {
        return res.status(403).json({ msg: 'Acceso denegado. Solo los usuarios con rol de Administrador tienen permiso para esta operación.' });
    }

    try {
        // Obtener los boletos que no tienen conductor asignado y cuyo estado es 'Pendiente'
        const boletos = await Boleto.find({ conductorAsignado: null, estadoPax: 'Pendiente' });

        // Verificar si se encontraron boletos
        if (boletos.length > 0) {
            // Crear un nuevo array de boletos con solo los detalles que necesitas
            const boletosFiltrados = boletos.map(boleto => ({
                tipoBoleto: boleto.tipoBoleto,
                nombre: boleto.user.nombre,
                apellido: boleto.user.apellido,
                ciudadSalida: boleto.ciudadSalida.ciudad,
                ciudadLlegada: boleto.ciudadLlegada.ciudad,
                turno: boleto.turno,
                id: boleto._id,
                numPax: boleto.numPax
            }));

            // Enviar respuesta con los boletos pendientes
            res.status(200).json({ mensaje: 'Viajes Compartidos Pendientes', boletos: boletosFiltrados });
        } else {
            // Enviar respuesta de error si no se encontraron boletos
            res.status(400).json({ error: 'No se encontraron viajes pendientes' });
        }
    } catch (error) {
        // Manejar errores
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


// LISTA UN VIAJE PENDIENTE
const viajeCompartidoId = async (req, res) => {
    const id = req.params.id; // Obtener el ID del parámetro de la ruta

    if (req.rol !== 'administrador') {
        return res.status(403).json({ msg: 'Acceso denegado. Solo los usuarios con rol de Administrador tienen permiso para esta operación.' });
    }

    try {
        // Buscar el boleto con el ID proporcionado
        const boleto = await Boleto.findById(id);

        // Verificar si se encontró el boleto
        if (boleto) {
            // Crear un objeto con solo los detalles que necesitas
            const boletoFiltrado = {
                tipoBoleto: boleto.tipoBoleto,
                nombre: boleto.user.nombre,
                apellido: boleto.user.apellido,
                ciudadSalida: boleto.ciudadSalida.ciudad,
                ciudadLlegada: boleto.ciudadLlegada.ciudad,
                turno: boleto.turno,
                id: boleto._id,
                numPax: boleto.numPax
            };

            // Enviar respuesta con el boleto
            res.status(200).json({ mensaje: 'Viaje Compartido', boleto: boletoFiltrado });
        } else {
            // Enviar respuesta de error si no se encontró el boleto
            res.status(400).json({ error: 'No se encontró el viaje pendiente con el ID proporcionado' });
        }
    } catch (error) {
        // Manejar errores
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


// Eliminar el viaje compartido
const eliminarBoletoCompId = async (req, res) => {
    const id = req.params.id; // Obtener el ID del parámetro de la ruta

    if (req.rol !== 'administrador') {
        return res.status(403).json({ msg: 'Acceso denegado. Solo los usuarios con rol de Administrador tienen permiso para esta operación.' });
    }

    try {
        // Eliminar el boleto con el ID proporcionado
        const boletoEliminado = await Boleto.findByIdAndDelete(id);

        // Verificar si se eliminó el boleto
        if (boletoEliminado) {
            // Enviar respuesta de éxito
            res.status(200).json({ mensaje: 'Boleto eliminado exitosamente' });
        } else {
            // Enviar respuesta de error si no se encontró el boleto
            res.status(400).json({ error: 'No se encontró el boleto con el ID proporcionado' });
        }
    } catch (error) {
        // Manejar errores
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


// ACTUALIZA SOLO EL ESTADO Y ASIGANACION DE UN CONDUCTOR 
const actualizarBoletoC = async (req, res) => {
    const id = req.params.id; // Obtener el ID del parámetro de la ruta

    // Solo tomar en cuenta los campos 'conductorAsignado' y 'estadoPax' del cuerpo de la solicitud
    const datosActualizados = {
        conductorAsignado: req.body.conductorAsignado,
        estadoPax: req.body.estadoPax
    };

    if (req.rol !== 'administrador') {
        return res.status(403).json({ msg: 'Acceso denegado. Solo los usuarios con rol de Administrador tienen permiso para esta operación.' });
    }

    try {
        // Verificar si el conductor existe
        const conductor = await Conductor.findById(req.body.conductorAsignado);
        if (!conductor) {
            return res.status(400).json({ error: 'No se encontró el conductor con el ID proporcionado' });
        }

        // Obtener el boleto actual
        const boletoActual = await Boleto.findById(id);

        // Verificar si el boleto existe
        if (!boletoActual) {
            return res.status(400).json({ error: 'No se encontró el boleto con el ID proporcionado' });
        }

        // Verificar el estado actual del boleto
        if (boletoActual.estadoPax !== 'Pendiente' && boletoActual.estadoPax !== 'Aprobado') {
            return res.status(400).json({ error: 'Solo se puede actualizar el estado del boleto cuando está en estado Pendiente o Aprobado' });
        }

        // Actualizar el boleto con el ID proporcionado
        const boletoActualizado = await Boleto.findByIdAndUpdate(id, datosActualizados, { new: true });

        // Enviar respuesta con los detalles del boleto actualizado
        res.status(200).json(boletoActualizado);
    } catch (error) {
        // Manejar errores
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


// ASIGNA UN CONDUCTOR
const asignarConductorVC = async (req, res) => {
    try {
        const { idBoleto, idConductor } = req.body;

        // Validar si idBoleto es una cadena válida ObjectId
        if (!mongoose.Types.ObjectId.isValid(idBoleto)) {
            return res.status(400).json({ error: 'ID de boleto no válido' });
        }

        // Convertir la cadena a ObjectId
        const boletoObjectId = new mongoose.Types.ObjectId(idBoleto);

        // Obtener el boleto y el conductor
        const boleto = await Boleto.findById(boletoObjectId);
        const conductor = await Conductor.findById(idConductor);

        // Verificar si el boleto y el conductor son válidos
        if (boleto && conductor) {
            // Verificar si el campo conductorAsignado del boleto está vacío
            if (!boleto.conductorAsignado) {
                // Obtener todos los boletos asignados al conductor
                const boletos = await Boleto.find({ conductorAsignado: conductor._id });

                // Sumar el número de pasajeros en todos los boletos
                let pasajerosAsignados = 0;
                for (let boleto of boletos) {
                    pasajerosAsignados += boleto.numPax;
                }

                // Verificar si hay suficientes asientos disponibles
                if (conductor.numeroAsientos - conductor.asientosOcupados >= boleto.numPax) {
                    // Actualizar el boleto con el conductor asignado y cambiar el estado del pasajero
                    boleto.conductorAsignado = conductor._id;
                    boleto.estadoPax = 'Aprobado';
                    await boleto.save();

                    // Actualizar el estado del conductor y el número de asientos ocupados
                    conductor.estado = 'Ocupado';
                    conductor.asientosOcupados += boleto.numPax;
                    await conductor.save();

                    // Enviar respuesta exitosa
                    res.status(200).json({
                        mensaje: 'Conductor asignado con éxito',
                        nombreConductor: conductor.conductorNombre + ' ' + conductor.conductorApellido,
                        asientosRequeridos: boleto.numPax
                    });
                } else {
                    // Enviar respuesta de error si no hay suficientes asientos
                    res.status(400).json({ error: 'No hay suficientes asientos disponibles' });
                }
            } else {
                // Enviar respuesta de error si el campo conductorAsignado del boleto no está vacío
                res.status(400).json({ error: 'El boleto ya tiene un conductor asignado' });
            }
        } else {
            // Enviar respuesta de error si el boleto o el conductor no son válidos
            res.status(400).json({ error: 'Error en la asignación de conductor' });
        }
    } catch (error) {
        // Manejar errores
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


export {
    viajesPendientesCompartidos,
    viajeCompartidoId,
    eliminarBoletoCompId,
    actualizarBoletoC,
    asignarConductorVC
}