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
        res.status(500).json({ msg: "Error al registrar el servicio" });
    }
};

export {
    registrarServicio
}
