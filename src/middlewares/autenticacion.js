import jwt from "jsonwebtoken";
import Administrador from "../models/adminDB.js";
import Pasajero from "../models/pasajeroDB.js";
import Conductor from "../models/conductorDB.js";

const verificarAutenticacion = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res
            .status(401)
            .json({ msg: "Lo sentimos, debes proporcionar un token" });
    }

    const { authorization } = req.headers;

    try {
        const { id, rol } = jwt.verify(
            authorization.split(" ")[1],
            process.env.JWT_SECRET
        );

        if (rol === "administrador") {
            req.administradorBDD = await Administrador.findById(id)
                .lean()
                .select("-password");
            req.rol = "administrador";
        } else if (rol === "pasajero") {
            req.pasajeroBDD = await Pasajero.findById(id).lean().select("-password");
            req.rol = "pasajero";
        } else if (rol === "conductor") {
            req.choferBDD = await Conductor.findById(id).lean().select("-password");
            req.rol = "conductor";
        } else {
            return res.status(401).json({ msg: "Rol no válido" });
        }

        next();
    } catch (error) {
        console.error(error); // Registra el error en el servidor, no lo expongas al cliente
        return res.status(401).json({ msg: "Error de autenticación" });
    }
};

export default verificarAutenticacion;
