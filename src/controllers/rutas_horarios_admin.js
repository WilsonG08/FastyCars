import RutayHorario from '../models/ruta_horario.js'
import mongoose from 'mongoose';

// REGISTRAR RUTA Y HORARIO 
const registrarRutaHorario = async (req, res) => {
    const { nombre, ciudad1, ciudad2, horario1, horario2, horario3 } = req.body;

    if (!nombre || !ciudad1 || !ciudad2 || !horario1 || !horario2 || !horario3) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    // Verificar si el origen y el destino son iguales
    if (ciudad1 == ciudad2) {
        return res.status(400).json({ msg: "Las ciudades de origen y destino no pueden ser iguales" });
    }

    try {
        // Verificar si ya existe una ruta con el mismo nombre
        const nombreExistente = await RutayHorario.findOne({
            "ruta.nombre": nombre,
        });

        if (nombreExistente) {
            return res.status(400).json({ msg: "Ya existe una ruta con ese nombre" });
        }

        // Verificar si ya existe una ruta con las mismas ciudades en el mismo orden
        const ciudadExistente = await RutayHorario.findOne({
            "ruta.ciudad1": ciudad1,
            "ruta.ciudad2": ciudad2
        });

        if (ciudadExistente) {
            return res.status(400).json({ msg: "Ya existe una ruta con esas ciudades de origen y destino en el mismo orden" });
        }

        // Crear la nueva ruta con horarios
        const nuevaRuta = new RutayHorario({
            ruta: { nombre, ciudad1, ciudad2 },
            horario: { horario1, horario2, horario3 }
        });

        // Guardar la nueva ruta
        await nuevaRuta.save();

        res.status(200).json({
            msg: "Ruta registrada con éxito",
            ruta: nuevaRuta
        });
    } catch (error) {
        res.status(500).json({ msg: "Hubo un error al registrar la ruta", error });
    }
};

// OBTENER LAS RUTAS Y HORARIOS
const obtenerRutasHorarios = async (req, res) => {
    try {
        const rutas = await RutayHorario.find();
        res.status(200).json(rutas);
    } catch (error) {
        res.status(500).json({ msg: "Hubo un error al obtener las rutas", error });
    }
};


// ACTUALIZAR RUTA Y HORARIO, POR id EN LA URL
const actualizarRutaHorario = async (req, res) => {
    const { nombre, ciudad1, ciudad2, horario1, horario2, horario3 } = req.body;
    const { id } = req.params;

    if (!nombre || !ciudad1 || !ciudad2 || !horario1 || !horario2 || !horario3) {
        return res
            .status(400)
            .json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    // Verificar si el origen y el destino son iguales
    if (ciudad1 == ciudad2) {
        return res
            .status(400)
            .json({ msg: "Las ciudades de origen y destino no pueden ser iguales" });
    }

    try {
        // Verificar si ya existe una ruta con el mismo nombre
        const nombreExistente = await RutayHorario.findOne({
            "ruta.nombre": nombre,
            _id: { $ne: id },
        });

        if (nombreExistente) {
            return res.status(400).json({ msg: "Ya existe una ruta con ese nombre" });
        }

        // Verificar si ya existe una ruta con las mismas ciudades en el mismo orden
        const ciudadExistente = await RutayHorario.findOne({
            "ruta.ciudad1": ciudad1,
            "ruta.ciudad2": ciudad2,
            _id: { $ne: id },
        });

        if (ciudadExistente) {
            return res
                .status(400)
                .json({
                    msg: "Ya existe una ruta con esas ciudades de origen y destino en el mismo orden",
                });
        }

        // Actualizar la ruta con los nuevos datos
        const rutaActualizada = await RutayHorario.findByIdAndUpdate(
            id,
            {
                ruta: { nombre, ciudad1, ciudad2 },
                horario: { horario1, horario2, horario3 },
            },
            { new: true }
        );

        res.status(200).json({
            msg: "Ruta actualizada con éxito",
            ruta: rutaActualizada,
        });
    } catch (error) {
        res.status(500).json({ msg: "Hubo un error al actualizar la ruta", error });
    }
};


// ELIMINAR RUTA Y HORARIO POR EL id EN LA URL
const eliminarRutaHorario = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ msg: "Lo sentimos, debes proporcionar el ID de la ruta" });
    }

    try {
        // Verificar si la ruta existe
        const rutaExistente = await RutayHorario.findById(id);

        if (!rutaExistente) {
            return res.status(404).json({ msg: "No se encontró ninguna ruta con ese ID" });
        }

        // Eliminar la ruta
        await RutayHorario.findByIdAndRemove(id);

        res.status(200).json({
            msg: "Ruta eliminada con éxito"
        });
    } catch (error) {
        res.status(500).json({ msg: "Hubo un error al eliminar la ruta", error });
    }
};


export {
    registrarRutaHorario,
    obtenerRutasHorarios,
    actualizarRutaHorario,
    eliminarRutaHorario
};
