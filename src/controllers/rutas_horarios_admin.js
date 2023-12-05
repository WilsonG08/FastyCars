import Horario from '../models/horarioDb.js';
import Ruta from '../models/rutaDB.js';
import mongoose from 'mongoose';


const registrarRuta = async (req, res) => {
    const { origen, destino } = req.body;

    if (!origen || !destino) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    // Verificar si el origen y el destino son iguales
    if (origen === destino) {
        return res.status(400).json({ msg: "El origen y el destino no pueden ser iguales" });
    }

    try {
        // Verificar si ya existe una ruta con el mismo origen y destino
        const rutaExistente = await Ruta.findOne({ origen, destino });

        if (rutaExistente) {
            return res.status(400).json({ msg: "La ruta ya está registrada" });
        }

        // Encontrar la última ruta registrada para obtener el último número
        const ultimaRuta = await Ruta.findOne({}, {}, { sort: { 'createdAt': -1 } });

        // Determinar el próximo número de ruta
        const proximoNumero = ultimaRuta ? parseInt(ultimaRuta.nombre.split(' ')[1]) + 1 : 1;

        // Crear el nombre de la nueva ruta
        const nuevoNombre = `Ruta ${proximoNumero}`;

        // Crear la nueva ruta
        const nuevaRuta = new Ruta({ nombre: nuevoNombre, origen, destino });

        // Guardar la nueva ruta
        await nuevaRuta.save();

        res.status(200).json({
            msg: "Ruta registrada con éxito",
            nombre: nuevoNombre
        });
    } catch (error) {
        res.status(500).json({ msg: "Hubo un error al registrar la ruta", error });
    }
};



const obtenerRutas = async (req, res) => {
    try {
        const rutas = await Ruta.find();
        res.status(200).json(rutas);
    } catch (error) {
        res.status(500).json({ msg: "Hubo un error al obtener las rutas", error });
    }
};



const actualizarRuta = async (req, res) => {
    try {
        const { origen, destino } = req.body;

        // Verificar si los campos obligatorios están presentes
        if (!origen || !destino) {
            return res.status(400).json({ msg: "Los campos 'origen' y 'destino' son obligatorios" });
        }

        // Verificar si el ID es válido
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ msg: "ID de ruta no válido" });
        }

        // Verificar si ya existe otra ruta con el mismo origen y destino
        const rutaExistente = await Ruta.findOne({ _id: { $ne: req.params.id }, origen, destino });

        if (rutaExistente) {
            return res.status(400).json({ msg: "Ya existe una ruta con el mismo origen y destino" });
        }

        // Actualizar la ruta por ID, solo actualizando origen y destino
        await Ruta.findByIdAndUpdate(req.params.id, { origen, destino });

        res.status(200).json({ msg: "Ruta actualizada con éxito" });
    } catch (error) {
        console.error("Error al actualizar la ruta:", error);
        res.status(500).json({ msg: "Hubo un error al actualizar la ruta", error });
    }
};



const eliminarRuta = async (req, res) => {
    try {
        // Verificar si el ID es válido
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ msg: "ID de ruta no válido" });
        }

        await Ruta.findByIdAndDelete(req.params.id);
        res.status(200).json({ msg: "Ruta eliminada con éxito" });
    } catch (error) {
        res.status(500).json({ msg: "Hubo un error al eliminar la ruta", error });
    }
};


const registrarHorario = async (req, res) => {
    const { nombreTurno, horaTurno } = req.body;

    if (!nombreTurno || !horaTurno) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    try {
        // Verificar si ya existe un horario con el mismo nombre
        const horarioExistente = await Horario.findOne({ nombreTurno });

        if (horarioExistente) {
            return res.status(400).json({ msg: "El horario ya está registrado" });
        }

        // Crear el nuevo horario
        const nuevoHorario = new Horario(req.body);

        // Guardar el nuevo horario
        await nuevoHorario.save();

        res.status(200).json({
            msg: "Horario registrado con éxito"
        });
    } catch (error) {
        res.status(500).json({ msg: "Hubo un error al registrar el horario", error });
    }
};


const actualizarHorario = async (req, res) => {
    try {
        const { nombreTurno, horaTurno  } = req.body;

        // Verificar si los campos obligatorios están presentes
        if (!nombreTurno || !horaTurno) {
            return res.status(400).json({ msg: "Los campos 'nombre' y 'hora' son obligatorios" });
        }

        // Verificar si el ID es válido
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ msg: "ID de horario no válido" });
        }

        // Verificar si ya existe otro horario con el mismo nombre
        const horarioExistentePorNombre = await Horario.findOne({ _id: { $ne: req.params.id }, nombreTurno });

        // Verificar si ya existe otro horario con la misma hora
        const horarioExistentePorHora = await Horario.findOne({ _id: { $ne: req.params.id }, horaTurno });

        if (horarioExistentePorNombre || horarioExistentePorHora) {
            return res.status(400).json({ msg: "Ya existe un horario con el mismo nombre o con la misma hora" });
        }

        // Actualizar el horario por ID, solo actualizando nombre y hora
        await Horario.findByIdAndUpdate(req.params.id, { nombreTurno, horaTurno });

        res.status(200).json({ msg: "Horario actualizado con éxito" });
    } catch (error) {
        console.error("Error al actualizar el horario:", error);
        res.status(500).json({ msg: "Hubo un error al actualizar el horario", error });
    }
};



const obtenerHorarios = async (req, res) => {
    try {
        const horarios = await Horario.find();
        res.status(200).json(horarios);
    } catch (error) {
        res.status(500).json({ msg: "Hubo un error al obtener los horarios", error });
    }
};

const eliminarHorario = async (req, res) => {
    try {
        // Verificar si el ID es válido
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ msg: "ID de horario no válido" });
        }

        await Horario.findByIdAndDelete(req.params.id);
        res.status(200).json({ msg: "Horario eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ msg: "Hubo un error al eliminar el horario", error });
    }
};



export {
    registrarRuta,
    obtenerRutas,
    actualizarRuta,
    eliminarRuta,
    registrarHorario,
    actualizarHorario,
    obtenerHorarios,
    eliminarHorario
};
