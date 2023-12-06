// controllers/reservaBoletoController.js
import ReservaBoleto from '../models/reservaDB.js';

const realizarReserva = async (req, res) => {
    try {
        const { desde, hasta, fecha, numeroAsientos } = req.body;
        const { pasajeroNombre, pasajeroApellido, phone } = req.pasajeroBDD;

        const nuevaReserva = new ReservaBoleto({
            pasajero: {
                nombre: pasajeroNombre,
                apellido: pasajeroApellido,
                phone: phone,
            },
            desde,
            hasta,
            fecha,
            numeroAsientos,
        });

        const reservaGuardada = await nuevaReserva.save();

        res.status(201).json({ msg: "Reserva de boleto exitosa", reserva: reservaGuardada });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al realizar la reserva de boleto" });
    }
};

export {
    realizarReserva
}
