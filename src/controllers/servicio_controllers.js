import Administrador from "../models/adminDB.js";
import Servicio from '../models/serviciosDb.js';


const registrarServicio = async (req, res) => {
    try {
        // Verificar si el administrador está autenticado
        const administradorActual = req.administradorBDD;
        if (!administradorActual) {
            return res.status(401).json({ msg: "No autorizado, el administrador no está autenticado." });
        }

        // Verificar si el administrador está registrado en la base de datos
        const administradorRegistrado = await Administrador.findById(administradorActual._id);
        if (!administradorRegistrado) {
            return res.status(401).json({ msg: "No autorizado, el administrador no está registrado en la base de datos." });
        }

        // Ahora puedes proceder a registrar el servicio
        const nuevoServicio = new Servicio({
            nombreServicio: req.body.nombreServicio,
            detalleServicio: req.body.detalleServicio,
            valorEstimado: req.body.valorEstimado,
        });

        // Guardar el nuevo servicio en la base de datos
        await nuevoServicio.save();

        res.status(201).json({ msg: "Servicio registrado correctamente", servicio: nuevoServicio });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Servicio duplicado!" });
    }
};


// Leer todos los servicios
const obtenerServicios = async (req, res) => {
    try {
        // Verificar si el administrador está autenticado
        const administradorActual = req.administradorBDD;
        if (!administradorActual) {
            return res.status(401).json({ msg: "No autorizado, el administrador no está autenticado." });
        }

        const servicios = await Servicio.find();
        res.status(200).json(servicios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al obtener los servicios" });
    }
};

// Leer un servicio por ID
const obtenerServicio = async (req, res) => {
    try {
        // Verificar si el administrador está autenticado
        const administradorActual = req.administradorBDD;
        if (!administradorActual) {
            return res.status(401).json({ msg: "No autorizado, el administrador no está autenticado." });
        }
        const servicio = await Servicio.findById(req.params.id);
        if (!servicio) {
            return res.status(404).json({ msg: "Servicio no encontrado" });
        }
        res.status(200).json(servicio);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al obtener el servicio" });
    }
};

// Actualizar un servicio por ID
const actualizarServicio = async (req, res) => {
    try {
        // Verificar si el administrador está autenticado
        const administradorActual = req.administradorBDD;
        if (!administradorActual) {
            return res.status(401).json({ msg: "No autorizado, el administrador no está autenticado." });
        }
        const servicio = await Servicio.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!servicio) {
            return res.status(404).json({ msg: "Servicio no encontrado" });
        }
        res.status(200).json({ msg: "Servicio actualizado correctamente", servicio });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al actualizar el servicio" });
    }
};

// Eliminar un servicio por ID
const eliminarServicio = async (req, res) => {
    try {
        // Verificar si el administrador está autenticado
        const administradorActual = req.administradorBDD;
        if (!administradorActual) {
            return res.status(401).json({ msg: "No autorizado, el administrador no está autenticado." });
        }
        await Servicio.findByIdAndDelete(req.params.id);
        res.status(200).json({ msg: "Servicio eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al eliminar el servicio" });
    }
};

export {
    registrarServicio,
    obtenerServicios,
    obtenerServicio,
    actualizarServicio,
    eliminarServicio
}

