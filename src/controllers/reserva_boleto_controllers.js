import Boleto from '../models/reservaDB.js';
import BoletoPrivado from '../models/viajePrivadoDB.js';
import mongoose from 'mongoose';


const realizarReserva = async (req, res) => {
    try {
        const { ciudadSalida, ciudadLlegada, numPax, turno, estadoPax, precio, distancia } = req.body;
        const { _id: pasajeroId } = req.pasajeroBDD;

        // Valida si algún campo está vacío
        for (let key in req.body) {
            if (typeof req.body[key] === 'object') {
                for (let subKey in req.body[key]) {
                    // Excluye el campo 'referencia' de la validación
                    if (subKey !== 'referencia' && !req.body[key][subKey]) {
                        return res.status(400).json({ msg: `El campo ${subKey} no puede estar vacío` });
                    }
                }
            } else {
                if (!req.body[key]) {
                    return res.status(400).json({ msg: `El campo ${key} no puede estar vacío` });
                }
            }
        }

        // Crea un nuevo boleto usando los datos obtenidos y el ID del pasajero
        const nuevoBoleto = new Boleto({
            pasajeroId,  // Añade este campo
            user: req.body.user,
            ciudadSalida,
            ciudadLlegada,
            numPax,
            turno,
            precio,
            distancia,
            estadoPax,
        });

        // Guarda el boleto en la base de datos
        const boletoGuardado = await nuevoBoleto.save();

        res.status(201).json({ result:true, msg: "Reserva de boleto exitosa", boleto: boletoGuardado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ result:false, msg: "Error al realizar la reserva de boleto" });
    }
};



/* 
const listarReservasCliente = async (req, res) => {
    try {
        const { clienteId } = req.body;  // Extrae el clienteId del cuerpo de la solicitud

        // Busca las reservas del cliente en la base de datos
        const reservasCliente = await Boleto.find({ pasajeroId: clienteId });

        res.status(200).json({ reservas: reservasCliente });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al obtener las reservas del cliente" });
    }
};
*/


const listarReservasCliente = async (req, res) => {
    try {
        const clienteId = req.params.id;  // Extrae el clienteId de los parámetros de la ruta

        // Busca las reservas del cliente en la base de datos
        const reservasClienteC = await Boleto.find({ pasajeroId: clienteId });
        const reservasClienteP = await BoletoPrivado.find({ pasajeroId: clienteId });

        res.status(200).json({ reservas: reservasClienteC, reservasClienteP });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al obtener las reservas del cliente" });
    }
};



/* 
const actualizarBoletoCliente = async (req, res) => {
    try {
        const clienteId = req.pasajeroBDD._id;
        const boletoId = req.params.id; // Obtén el ID del boleto a actualizar desde los parámetros de la ruta
        const updateData = req.body; // Datos de actualización

        // Verifica si el ID del boleto es válido
        if (!boletoId) {
            return res.status(400).json({ msg: "ID de boleto no proporcionado" });
        }

        // Actualiza el boleto solo si pertenece al cliente que ha iniciado sesión
        const boletoActualizado = await Boleto.findOneAndUpdate(
            { _id: boletoId, clienteId },
            { $set: updateData },
            { new: true }
        );

        // Verifica si se encontró y actualizó el boleto
        if (!boletoActualizado) {
            return res.status(404).json({ msg: "Boleto no encontrado o no pertenece al cliente" });
        }

        res.status(200).json({ msg: "Boleto actualizado con éxito", boleto: boletoActualizado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al actualizar el boleto" });
    }
};
*/

const actualizarBoletoCliente = async (req, res) => {
    try {
        const clienteId = req.pasajeroBDD._id;
        const boletoId = req.params.id; // Obtén el ID del boleto a actualizar desde los parámetros de la ruta
        const updateData = req.body; // Datos de actualización

        // Verifica si el ID del boleto es válido
        if (!boletoId) {
            return res.status(400).json({ msg: "ID de boleto no proporcionado" });
        }

        // Busca el boleto en la base de datos
        const boleto = await Boleto.findOne({ _id: boletoId, pasajeroId: clienteId });

        // Verifica si se encontró el boleto
        if (!boleto) {
            return res.status(404).json({ msg: "Boleto no encontrado o no pertenece al cliente" });
        }

        // Verifica si el estadoPax es 'Pendiente'
        if (boleto.estadoPax !== 'Pendiente') {
            return res.status(400).json({ msg: "El estado del boleto no es 'Pendiente'" });
        }

        // Actualiza el boleto
        const boletoActualizado = await Boleto.findOneAndUpdate(
            { _id: boletoId, pasajeroId: clienteId },
            { $set: updateData },
            { new: true }
        );

        res.status(200).json({ msg: "Boleto actualizado con éxito", boleto: boletoActualizado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al actualizar el boleto" });
    }
};

/* 
const eliminarReservaCliente = async (req, res) => {
    try {
        const clienteId = req.pasajeroBDD._id;
        const boletoId = req.params.id; // Obtén el ID del boleto a eliminar desde los parámetros de la ruta

        // Verifica si el ID del boleto es válido
        if (!boletoId) {
            return res.status(400).json({ msg: "ID de boleto no proporcionado" });
        }

        // Elimina el boleto solo si pertenece al cliente que ha iniciado sesión
        const boletoEliminado = await Boleto.findOneAndDelete({ _id: boletoId, clienteId });

        // Verifica si se encontró y eliminó el boleto
        if (!boletoEliminado) {
            return res.status(404).json({ msg: "Boleto no encontrado o no pertenece al cliente" });
        }

        res.status(200).json({ msg: "Boleto eliminado con éxito", boleto: boletoEliminado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al eliminar el boleto" });
    }
};
*/



const eliminarReservaCliente = async (req, res) => {
    try {
        const clienteId = req.pasajeroBDD._id;
        const boletoId = req.params.id; // Obtén el ID del boleto a eliminar desde los parámetros de la ruta

        // Verifica si el ID del boleto es válido
        if (!boletoId) {
            return res.status(400).json({ msg: "ID de boleto no proporcionado" });
        }

        // Busca el boleto en la base de datos
        const boleto = await Boleto.findOne({ _id: boletoId, pasajeroId: clienteId });

        // Verifica si se encontró el boleto
        if (!boleto) {
            return res.status(404).json({ msg: "Boleto no encontrado" });
        }

        // Verifica si el boleto pertenece al cliente
        if (!mongoose.Types.ObjectId.isValid(boleto.pasajeroId) || boleto.pasajeroId.toString() !== clienteId.toString()) {
            return res.status(403).json({ msg: "El boleto no pertenece al cliente" });
        }

        // Verifica si el estadoPax es 'Pendiente'
        if (boleto.estadoPax !== 'Pendiente') {
            return res.status(400).json({ msg: "El estado del boleto no es 'Pendiente'" });
        }

        // Elimina el boleto
        const boletoEliminado = await Boleto.findOneAndDelete({ _id: boletoId, pasajeroId: clienteId });

        res.status(200).json({ msg: "Boleto eliminado con éxito", boleto: boletoEliminado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al eliminar el boleto" });
    }
};




export {
    realizarReserva,
    listarReservasCliente,
    actualizarBoletoCliente,
    eliminarReservaCliente
}
