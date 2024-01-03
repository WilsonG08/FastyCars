import BoletoPrivado from '../models/viajePrivadoDB.js';

const reservaBoletoPriv = async (req, res) => {
    try {
        const { ciudadSalida, ciudadLlegada, numPax, turno, estadoPax, precio } = req.body;

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


const listarBoletosPriv = async (req, res) => {
    try {
        const clienteId = req.pasajeroBDD._id;

        // Busca las reservas del cliente en la base de datos
        const reservasCliente = await BoletoPrivado.find({ clienteId });

        // Añade el tipo de boleto al principio de cada reserva y excluye los campos createdAt y updatedAt
        const reservasConTipo = reservasCliente.map(reserva => {
            const { createdAt, updatedAt, ...reservaSinTimestamps } = reserva._doc;
            return { tipoBoleto: reserva.tipoBoleto, ...reservaSinTimestamps };
        });

        res.status(200).json({ reservas: reservasConTipo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al obtener las reservas del cliente" });
    }
};


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






export {
    reservaBoletoPriv,
    listarBoletosPriv,
    actualizarBoletoPriv,
    eliminarBoletoPriv
}