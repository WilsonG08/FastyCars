import jwt from 'jsonwebtoken'
import Pasajero from '../models/pasajeroDB.js'

const verificarAutentificacion = async ( req, res, next ) => {

    if(!req.headers.authorization) return res.status(404).json({msg:"Lo sentimos, debes proprocionar un token"})    

    const { authorization } = req.headers

    try {
        const { id } = jwt.verify(authorization.split(' ')[1],process.env.JWT_SECRET)

        req.pasajeroBDD = await Pasajero.findById(id).lean().select("-password")

        next()
    } catch (error) {
        const e = new Error("Formato del token no valido")

        return res.status(404).json({msg: e.message})
    }
}

export default verificarAutentificacion