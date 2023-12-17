import Boleto from '../models/reservaDB.js';

/* 
const realizarReserva = async (req, res) => {
    try {
        const { ciudadSalida, ciudadLlegada, fecha, numPax, turno, estadoPax, precio } = req.body;
        const { pasajeroNombre, pasajeroApellido, phone } = req.pasajeroBDD;

        // Valida si algún campo está vacío
        for (let key in req.body) {
            if (typeof req.body[key] === 'object') {
                for (let subKey in req.body[key]) {
                    if (!req.body[key][subKey]) {
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
        const nuevoBoleto = new Boleto({
            user: {
                nombre: pasajeroNombre,
                apellido: pasajeroApellido,
                phone: phone,
            },
            ciudadSalida,
            ciudadLlegada,
            numPax,
            turno,
            precio,
            estadoPax,
        });

        // Guarda el boleto en la base de datos
        const boletoGuardado = await nuevoBoleto.save();

        res.status(201).json({ msg: "Reserva de boleto exitosa", boleto: boletoGuardado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al realizar la reserva de boleto" });
    }
};

 */

const realizarReserva = async (req, res) => {
    try {
        const { ciudadSalida, ciudadLlegada, fecha, numPax, turno, estadoPax, precio } = req.body;
        const { pasajeroNombre, pasajeroApellido, phone, _id: clienteId } = req.pasajeroBDD;

        // Valida si algún campo está vacío
        for (let key in req.body) {
            if (typeof req.body[key] === 'object') {
                for (let subKey in req.body[key]) {
                    if (!req.body[key][subKey]) {
                        return res.status(400).json({ msg: `El campo ${subKey} no puede estar vacío` });
                    }
                }
            } else {
                if (!req.body[key]) {
                    return res.status(400).json({ msg: `El campo ${key} no puede estar vacío` });
                }
            }
        }

        // Crea un nuevo boleto usando los datos obtenidos y el ID del cliente
        const nuevoBoleto = new Boleto({
            clienteId,
            user: {
                nombre: pasajeroNombre,
                apellido: pasajeroApellido,
                phone: phone,
            },
            ciudadSalida,
            ciudadLlegada,
            numPax,
            turno,
            precio,
            estadoPax,
        });

        // Guarda el boleto en la base de datos
        const boletoGuardado = await nuevoBoleto.save();

        res.status(201).json({ msg: "Reserva de boleto exitosa", boleto: boletoGuardado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al realizar la reserva de boleto" });
    }
};


const listarBoletos = async (req, res) => {
    try {
        const boleto = await Boleto.find({}, 'pasajeroNombre pasajeroApellido correo phone rol'); // Especifica los campos que deseas recuperar

        res.status(200).json(boleto);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar los pasajeros' });
    }
};


const actualizarBoleto = async (req, res) => {
    try {
        const boletoId = req.params.id; // Obtén el ID del boleto a actualizar desde los parámetros de la ruta
        const updateData = req.body; // Datos de actualización

        // Verifica si el ID del boleto es válido
        if (!boletoId) {
            return res.status(400).json({ msg: "ID de boleto no proporcionado" });
        }

        // Actualiza el boleto en la base de datos
        const boletoActualizado = await Boleto.findByIdAndUpdate(
            boletoId,
            { $set: updateData },
            { new: true }
        );

        // Verifica si se encontró y actualizó el boleto
        if (!boletoActualizado) {
            return res.status(404).json({ msg: "Boleto no encontrado" });
        }

        res.status(200).json({ msg: "Boleto actualizado con éxito", boleto: boletoActualizado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al actualizar el boleto" });
    }
};

export {
    realizarReserva,
    actualizarBoleto
}
