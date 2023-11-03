import jwt from 'jsonwebtoken'
import Administrador from '../models/adminDB.js'


const verificarAutentificacion = async (req, res, next) => {

    if (!req.headers.authorization) return res.status(404).json({ msg: "Lo sentimos, debes proprocionar un token" })

    const { authorization } = req.headers

    try {
        const { id, rol } = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET)
        
        if (rol === "administrador") {
            // Agrega el código para consultar la base de datos del administrador aquí
            req.administradorBDD = await Administrador.findById(id).lean().select("-password");
            req.rol = "administrador";
        } else if (rol === "pasajero") {
            // Agrega el código para consultar la base de datos del pasajero aquí
            req.pasajeroBDD = await Pasajero.findById(id).lean().select("-password");
            req.rol = "pasajero";
        } else if (rol === "chofer") {
            // Agrega el código para consultar la base de datos del chofer aquí            
            req.choferBDD = await Chofer.findById(id).lean().select("-password");
            req.rol = "chofer";
        } else {
            // Si el rol no coincide con ninguno de los roles definidos
            return res.status(404).json({ msg: "Rol no válido" });
        }
        
        next()
        
    } catch (error) {
        const e = new Error("Formato del token no valido")

        return res.status(404).json({ msg: e.message })
    }
}



export default verificarAutentificacion
