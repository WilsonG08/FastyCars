import Boleto from '../models/reservaDB.js';
import BoletoPrivado from '../models/viajePrivadoDB.js';
import Encomienda from '../models/encomiendaDb.js';

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

        // Crea un nuevo boleto
        const nuevoBoleto = new Boleto({
            pasajeroId,
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



const listarReservasCliente = async (req, res) => {
    try {
        const clienteId = req.params.id;  // Extrae el clienteId de los parámetros de la ruta

        // Busca las reservas del cliente en la base de datos
        const reservasClienteC = await Boleto.find({ pasajeroId: clienteId });
        const reservasClienteP = await BoletoPrivado.find({ pasajeroId: clienteId });
        const reservasClienteE = await Encomienda.find({ pasajeroId: clienteId });

        res.status(200).json({ reservas: reservasClienteC, reservasClienteP, reservasClienteE });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al obtener las reservas del cliente" });
    }
};


const actualizarBoletoCliente = async (req, res) => {
    try {
        const clienteId = req.pasajeroBDD._id;
        const boletoId = req.params.id; // Obtén el ID del boleto a actualizar desde los parámetros de la ruta
        let updateData = req.body; // Datos de actualización

        // Verifica si el ID del boleto es válido
        if (!boletoId) {
            return res.status(400).json({ msg: "ID de boleto no proporcionado" });
        }

        // Verifica si el cliente está tratando de actualizar el estado
        if (updateData.estadoPax) {
            return res.status(400).json({ msg: "No puedes actualizar el estado del boleto" });
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





const eliminarReservaCliente = async (req, res) => {
    try {
        const clienteId = req.pasajeroBDD._id;
        const boletoId = req.params.id; // Obtén el ID del boleto a eliminar desde los parámetros de la ruta

        // Verifica si el ID del boleto es válido
        if (!boletoId) {
            return res.status(400).json({ msg: "ID de boleto no proporcionado" });
        }

        // Busca el boleto en las bases de datos
        const boletoC = await Boleto.findOne({ _id: boletoId, pasajeroId: clienteId });
        const boletoP = await BoletoPrivado.findOne({ _id: boletoId, pasajeroId: clienteId });
        const boletoE = await Encomienda.findOne({ _id: boletoId, pasajeroId: clienteId });

        const boletos = [boletoC, boletoP, boletoE];
        let boletoEliminado;

        for (const boleto of boletos) {
            if (boleto) {
                // Verifica si el boleto pertenece al cliente
                if (!mongoose.Types.ObjectId.isValid(boleto.pasajeroId) || boleto.pasajeroId.toString() !== clienteId.toString()) {
                    return res.status(403).json({ msg: "El boleto no pertenece al cliente" });
                }

                // Verifica si el estadoPax es 'Pendiente'
                if (boleto.estadoPax !== 'Pendiente') {
                    return res.status(400).json({ msg: "El estado del boleto no es 'Pendiente'" });
                }

                // Elimina el boleto
                boletoEliminado = await boleto.deleteOne();
                break;
            }
        }

        if (!boletoEliminado) {
            return res.status(404).json({ msg: "Boleto no encontrado" });
        }

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
    eliminarReservaCliente,
}
