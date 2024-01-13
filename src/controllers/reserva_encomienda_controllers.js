import Encomienda from '../models/encomiendaDb.js';

const reservaEncomienda = async (req, res) => {
    try {
        const { remitente, destinatario, ciudadRemitente, ciudadDestinatario, numPaquetes, turno, estadoPaquete, precio } = req.body;
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

        // Crea una nueva encomienda usando los datos obtenidos
        const nuevaEncomienda = new Encomienda({
            pasajeroId,
            user: req.body.user,
            remitente,
            destinatario,
            ciudadRemitente,
            ciudadDestinatario,
            numPaquetes,
            turno,
            precio,
            estadoPaquete,
        });

        // Guarda la encomienda en la base de datos
        const encomiendaGuardada = await nuevaEncomienda.save();

        res.status(201).json({ result:true, msg: "Reserva de encomienda exitosa", encomienda: encomiendaGuardada });
    } catch (error) {
        console.error(error);
        res.status(500).json({ result:false, msg: "Error al realizar la reserva de encomienda" });
    }
};


const actualizarEncomienda = async (req, res) => {
    try {
        const clienteId = req.pasajeroBDD._id;
        const encomiendaId = req.params.id; // Obtén el ID de la encomienda a actualizar desde los parámetros de la ruta
        let datosActualizados = req.body; // Datos de actualización

        // Verifica si el ID de la encomienda es válido
        if (!encomiendaId) {
            return res.status(400).json({ msg: "ID de encomienda no proporcionado" });
        }

        // Verifica si el cliente está tratando de actualizar el estado
        if (datosActualizados.estadoPaquete) {
            return res.status(400).json({ msg: "No puedes actualizar el estado del paquete" });
        }

        // Busca la encomienda en la base de datos
        const encomienda = await Encomienda.findOne({ _id: encomiendaId, pasajeroId: clienteId });

        // Verifica si se encontró la encomienda
        if (!encomienda) {
            return res.status(404).json({ msg: "Encomienda no encontrada o no pertenece al cliente" });
        }

        // Verifica si el estadoPaquete es 'Pendiente'
        if (encomienda.estadoPaquete !== 'Pendiente') {
            return res.status(400).json({ msg: "El estado del paquete no es 'Pendiente'" });
        }

        // Actualiza la encomienda
        const encomiendaActualizada = await Encomienda.findOneAndUpdate(
            { _id: encomiendaId, pasajeroId: clienteId },
            { $set: datosActualizados },
            { new: true }
        );

        res.status(200).json({ msg: "Encomienda actualizada con éxito", encomienda: encomiendaActualizada });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al actualizar la encomienda" });
    }
};




export{
    reservaEncomienda,
    actualizarEncomienda,
}