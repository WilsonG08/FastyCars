import BoletoPrivado from '../models/viajePrivadoDB.js';
import mongoose from 'mongoose';


const reservaBoletoPriv = async (req, res) => {
    try {
        //const { ciudadSalida, ciudadLlegada, numPax, turno, estadoPax, precio } = req.body;
        const { ciudadSalida, ciudadLlegada, numPax, turno, estadoPax, precio } = req.body;
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

        // Crea un nuevo boleto usando los datos obtenidos
        const nuevoBoleto = new BoletoPrivado({
            pasajeroId,
            user: req.body.user,
            ciudadSalida,
            ciudadLlegada,
            numPax,
            turno,
            precio,
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
const actualizarBoletoPriv = async (req, res) => {
    try {
        const { id } = req.params; // ID de la reserva a actualizar
        let datosActualizados = req.body; // Datos a actualizar

        // Excluye el campo estadoPax de los datos a actualizar
        if (datosActualizados.hasOwnProperty('estadoPax')) {
            delete datosActualizados.estadoPax;
        }

        // Busca la reserva por ID y actualiza los datos
        const reservaActualizada = await BoletoPrivado.findByIdAndUpdate(id, datosActualizados, { new: true });

        if (!reservaActualizada) {
            return res.status(404).json({ msg: "No se encontró la reserva con el ID proporcionado" });
        }

        res.status(200).json({ reserva: reservaActualizada });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al actualizar la reserva" });
    }
};
*/


const actualizarBoletoPriv = async (req, res) => {
    try {
        const clienteId = req.pasajeroBDD._id;
        const boletoId = req.params.id; // Obtén el ID del boleto a actualizar desde los parámetros de la ruta
        const updateData = req.body; // Datos de actualización

        // Verifica si el ID del boleto es válido
        if (!boletoId) {
            return res.status(400).json({ msg: "ID de boleto no proporcionado" });
        }

        // Busca el boleto en la base de datos
        const boleto = await BoletoPrivado.findOne({ _id: boletoId, pasajeroId: clienteId });

        // Verifica si se encontró el boleto
        if (!boleto) {
            return res.status(404).json({ msg: "Boleto no encontrado o no pertenece al cliente" });
        }

        // Verifica si el estadoPax es 'Pendiente'
        if (boleto.estadoPax !== 'Pendiente') {
            return res.status(400).json({ msg: "El estado del boleto no es 'Pendiente'" });
        }

        // Actualiza el boleto
        const boletoActualizado = await BoletoPrivado.findOneAndUpdate(
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
const eliminarBoletoPriv = async (req, res) => {
    try {
        const { id } = req.params; // ID de la reserva a eliminar

        // Busca la reserva por ID y la elimina
        const reservaEliminada = await BoletoPrivado.findByIdAndDelete(id);

        if (!reservaEliminada) {
            return res.status(404).json({ msg: "No se encontró la reserva con el ID proporcionado" });
        }

        res.status(200).json({ msg: "Reserva eliminada exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al eliminar la reserva" });
    }
};
*/

const eliminarBoletoPriv = async (req, res) => {
    try {
        const clienteId = req.pasajeroBDD._id;
        const boletoId = req.params.id; // Obtén el ID del boleto a eliminar desde los parámetros de la ruta

        // Verifica si el ID del boleto es válido
        if (!boletoId) {
            return res.status(400).json({ msg: "ID de boleto no proporcionado" });
        }

        // Busca el boleto en la base de datos
        const boleto = await BoletoPrivado.findOne({ _id: boletoId, pasajeroId: clienteId });

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
        const boletoEliminado = await BoletoPrivado.findOneAndDelete({ _id: boletoId, pasajeroId: clienteId });

        res.status(200).json({ msg: "Boleto eliminado con éxito", boleto: boletoEliminado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al eliminar el boleto" });
    }
};


export {
    reservaBoletoPriv,
    actualizarBoletoPriv,
    eliminarBoletoPriv,
}