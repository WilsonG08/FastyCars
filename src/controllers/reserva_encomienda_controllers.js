import Encomienda from '../models/encomiendaDb.js';

const reservaEncomienda = async (req, res) => {
    try {
        const { remitente, destinatario, ciudadRemitente, ciudadDestinatario, numPaquetes, turno, estadoPaquete, precio } = req.body;

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


const listarEncomiendas = async (req, res) => {
    try {
        // Busca todas las encomiendas en la base de datos
        const encomiendas = await Encomienda.find({});

        res.status(200).json({ encomiendas });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al obtener las encomiendas" });
    }
};



const actualizarEncomienda = async (req, res) => {
    try {
        const { id } = req.params; // ID de la encomienda a actualizar
        let datosActualizados = req.body; // Datos a actualizar

        // Excluye los campos que no deseas actualizar
        if (datosActualizados.hasOwnProperty('estadoPaquete')) {
            delete datosActualizados.estadoPaquete;
        }

        // Busca la encomienda por ID y actualiza los datos
        const encomiendaActualizada = await Encomienda.findByIdAndUpdate(id, datosActualizados, { new: true });

        if (!encomiendaActualizada) {
            return res.status(404).json({ msg: "No se encontró la encomienda con el ID proporcionado" });
        }

        res.status(200).json({ encomienda: encomiendaActualizada });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al actualizar la encomienda" });
    }
};



const eliminarEncomienda = async (req, res) => {
    try {
        const { id } = req.params; // ID de la encomienda a eliminar

        // Busca la encomienda por ID y la elimina
        const encomiendaEliminada = await Encomienda.findByIdAndRemove(id);

        if (!encomiendaEliminada) {
            return res.status(404).json({ msg: "No se encontró la encomienda con el ID proporcionado" });
        }

        res.status(200).json({ msg: "Encomienda eliminada exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al eliminar la encomienda" });
    }
};




export{
    reservaEncomienda,
    listarEncomiendas,
    actualizarEncomienda,
    eliminarEncomienda
}