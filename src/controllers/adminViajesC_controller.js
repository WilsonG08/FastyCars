import Administrador from "../models/adminDB.js";
import Pasajero from '../models/pasajeroDB.js'
import Conductor from "../models/conductorDB.js";
import generarJWT from "../helpers/crearJWT.js";
import mongoose from "mongoose";
import Boleto from '../models/reservaDB.js'


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



export {
    viajesPendientesCompartidos,
    viajeCompartidoId,
    eliminarBoletoCompId,
    actualizarBoletoC
}