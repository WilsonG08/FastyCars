import Conductor from '../models/conductorDB.js'
import mongoose from 'mongoose';
import generarJWT from "../helpers/crearJWT.js";

import {
    sendMailToRecoveryPasswordChofer
} from "../config/nodemailer.js";

const listarchoferes = async(req, res) =>{
    const chofer = await Conductor.find({estado:true}).where('Chofer').equals(req.choferBDD).select("-createdAt  -updateAt").populate('Chofer', '_id name lastName')
    
    res.status(200).json(chofer)
}

const detalleChofer =  async( req, res ) =>{
    const { id } = req.params

    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg: `Lo sentimos, no existe el chofer ${id}`});

    const chofer = await Chofer.findById(id).select("-createdAt -updatedAt -__v").populate('administrdor','_id name lastName')
    
    res.status(200).json(chofer)
}


const actualizarChofer = async (req, res) => {
    const { id } = req.params

    if( Object.values(req.body).includes("")) return res.status(400).json({msg: "Lo sentimos, debes llenar todos los campos"})

    if( !mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({msg:`Lo sentimos, no existe el Chofer ${id}`})

    await Chofer.findByIdAndUpdate(req.params.id,req.body)

    res.status(200).json({msg: "Actualizacion exitosa del chofer"})
}


const confirmEmail = async (req,res) => {
    if( !(req.params.token) ) return res.status(400).json({msg: "Lo sentimos, no se puede validar la cuenta"})

    const choferBDD = await Conductor.findOne({token:req.params.token})

    if( !choferBDD?.token ) return res.status(404).json({msg: "La cuenta ya ha sido confirmada CHOFER"})

    choferBDD.token = null

    choferBDD.confirmEmail = true

    await choferBDD.save()

    res.status(200).json({msg: "Token cofirmado, ya puedes iniciar sesion querido CHOFER"})
}

// esta funcion no tiene que ir 
const eliminarChofer = async(req, res) => {
    const { id } = req.params

    if( Object.values(req.body).includes("")) return res.status(400).json({msg: "Lo sentimos, debes llenar todos los campos"})

    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg: `Lo sentimos, no existe el Chofer ${id}`})

    // duda, no va esta linea
    const { salida } = req.body

    await Conductor.findByIdAndUpdate(req.params.id,{salida: Date.parse(salida),estado:false})

    res.status(200).json({msg: "Fecha de salida"})
}

const actualizarPassword = async (req, res) => {

    const choferBDD = await Conductor.findById(req.choferBDD._id)

    if (!choferBDD) return res.status(404).json({ msg: `Lo sentimos, no existe el conductor ${id}` })

    const verificarPassword = await choferBDD.matchPassword(req.body.passwordactual)

    if (!verificarPassword) return res.status(404).json({ msg: "Lo sentimos, el password actual no es el correcto" })

    choferBDD.password = await choferBDD.encrypPassword(req.body.passwordnuevo)

    await choferBDD.save()

    res.status(200).json({ msg: "Password actualizado correctamente!" })
}


const recuperarPassword = async (req, res) => {
    const { correo } = req.body;

    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" })

    const choferBDD = await Conductor.findOne({ correo })

    if (!choferBDD) return res.status(404).json({ msg: "Lo sentimos, el conductor no se encuentra registrado" })

    const token = choferBDD.crearToken()

    choferBDD.token = token

    await sendMailToRecoveryPasswordChofer(correo, token)

    await choferBDD.save()

    res.status(200).json({ msg: "Revisa tu correo electronico para reestablecer tu cuenta" })
}

const comprobarTokenPassword = async (req, res) => {
    if (!(req.params.token)) return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" })

    const choferBDD = await Conductor.findOne({ token: req.params.token })

    if (choferBDD?.token !== req.params.token) return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" })

    await choferBDD.save()

    res.status(200).json({ msg: "Token confirmado, ya puedes crear tu nuevo password" })
}


const nuevoPassword = async (req, res) => {

    const { password, confirmpassword } = req.body

    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" })

    if (password != confirmpassword) return res.status(404).json({ msg: "Lo sentimos, los passwords no coinciden!" })

    const choferBDD = await Chofer.findOne({ token: req.params.token })

    if (choferBDD?.token !== req.params.token) return res.status(404).json({ msg: "LO sentimos, no se puede validar la cuenta" })

    choferBDD.token = null

    choferBDD.password = await choferBDD.encrypPassword(password)

    await choferBDD.save()

    res.status(200).json({ msg: "Felicidades, ya puedes iniciar sesion con tu nuevo password" })
}

export {
    listarchoferes,
    detalleChofer,
    actualizarChofer,
    eliminarChofer,
    confirmEmail,
    actualizarPassword,
    recuperarPassword,
    comprobarTokenPassword,
    nuevoPassword
}

