/* import Boleto from '../models/reservaDB.js';
import Ruta from '../models/rutaDB.js'
import Horario from '../models/horarioDb.js'


const realizarReserva = async (req, res) => {
    try {
        const { ciudadSalida, ciudadLlegada, fecha, numPax, turno, estadoPax } = req.body;
        const { pasajeroNombre, pasajeroApellido, phone } = req.pasajeroBDD;

        // Encuentra las rutas correspondientes a las ciudades de salida y llegada
        const rutaSalida = await Ruta.findOne({ origen: ciudadSalida.ciudad });
        const rutaLlegada = await Ruta.findOne({ destino: ciudadLlegada.ciudad });

        // Encuentra los horarios correspondientes a la fecha y turno
        const horario = await Horario.findOne({
            nombreTurno: turno.horario,
            fecha: turno.fecha,
        });

        // Verifica si las rutas y el horario se encontraron
        if (!rutaSalida) {
            return res.status(404).json({ msg: "No se encontró la ruta de salida" });
        }

        if (!rutaLlegada) {
            return res.status(404).json({ msg: "No se encontró la ruta de llegada" });
        }

        if (!horario) {
            return res.status(404).json({ msg: "No se encontró el horario" });
        }

        // Verifica si la ciudad de llegada está en la ruta de salida
        if (rutaSalida.destino !== ciudadLlegada.ciudad) {
            return res.status(400).json({ msg: "La ciudad de llegada no coincide con la ruta de salida" });
        }

        // Crea un nuevo boleto usando los datos obtenidos
        const nuevoBoleto = new Boleto({
            user: {
                nombre: pasajeroNombre,
                apellido: pasajeroApellido,
                phone: phone,
            },
            ciudadSalida: {
                ruta: rutaSalida._id,
                ciudad: ciudadSalida.ciudad,
            },
            ciudadLlegada: {
                ruta: rutaLlegada._id,
                ciudad: ciudadLlegada.ciudad,
            },
            numPax,
            turno: {
                horario: horario._id,
                fecha: turno.fecha,
            },
            estadoPax,
        });

        // Guarda el boleto en la base de datos
        const boletoGuardado = await nuevoBoleto.save();
        const boletoConDetalles = await Boleto
            .findById(boletoGuardado._id)
            .populate('ciudadSalida.ruta')
            .populate('ciudadLlegada.ruta')
            .populate('turno.horario');

        res.status(201).json({ msg: "Reserva de boleto exitosa", boleto: boletoConDetalles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al realizar la reserva de boleto" });
    }
};








export {
    realizarReserva
}
 */