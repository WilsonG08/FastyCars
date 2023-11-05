import Pasajero from '../models/pasajeroDB.js'
import { sendMailToUser, sendMailToRecoveryPassword } from "../config/nodemailer.js"
import generarJWT from "../helpers/crearJWT.js"
import mongoose from "mongoose";

const login = async(req, res) => {
    const { email, password } = req.body

    if( Object.values(req.body).includes("") ) return res.status(404).json({msg: "Lo sentimos, debes llenar todos los campos"})

    const pasajeroBDD = await Pasajero.findOne({email}).select("-status -__v -token -updatedAt -createdAt")

    if( pasajeroBDD?.confirmEmail === false ) return res.status(403).json({msg: "Lo sentimos, debe verificar su cuenta"})

    if ( !pasajeroBDD ) return res.status(404).json({msg: "Lo sentimos, el usuario no se encuentra regitrado"})

    const verificarPassword = await pasajeroBDD.matchPassword(password)

    if( !verificarPassword ) return res.status(404).json({msg: "Lo sentimos, el password no es correcto"})

    const token = generarJWT(pasajeroBDD._id,"pasajero")

    const { pasajeroName, pasajeroLastName, phone, _id } = pasajeroBDD

    res.status(200).json({
        token,
        pasajeroName,
        pasajeroLastName,
        phone,
        _id,
        email:pasajeroBDD.email
    })
}


const perfil = (req, res) => {
    delete req.pasajeroBDD.token
    delete req.pasajeroBDD.confirmEmail
    delete req.pasajeroBDD.createAt
    delete req.pasajeroBDD.updateAt
    delete req.pasajeroBDD.__v

    res.status(200).json(req.pasajeroBDD)
}


const confirmEmail = async (req,res) => {
    if( !(req.params.token) ) return res.status(400).json({msg: "Lo sentimos, no se puede validar la cuenta"})

    const pasajeroBDD = await Pasajero.findOne({token:req.params.token})

    if( !pasajeroBDD?.token ) return res.status(404).json({msg: "La cuenta ya ha sido confirmada PASAJERO"})

    pasajeroBDD.token = null

    pasajeroBDD.confirmEmail = true

    await pasajeroBDD.save()

    res.status(200).json({msg: "Token cofirmado, ya puedes iniciar sesion!"})
}


const listarPasajeros = async (req, res) => {
    res.status(200).json({res: "Lista de pasajeros registrados" })
}


const detallePasajero = async (req, res) => {
    const { id } = req.params

    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg: `Lo sentimos, debe ser un Id vlaido: ${id}`})

    const pasajeroBDD = await Pasajero.findOne(id).select("-password")

    if( !pasajeroBDD ) return res.status(404).json({msg: `Lo sentimos, no existe el pasajero con el ID: ${id}`})

    res.status(200).json({msg: pasajeroBDD})
}

const actualizarPerfil = async (req, res) => {
    const { id } = req.params

    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg: `Lo sentimos, debe ser un id válido: ${id}`})

    if( Object.values(req.body).includes("") ) return res.status(400).json({msg: "Lo sentimos, debs de llenar todos los campos"})

    const pasajeroBDD = await Pasajero.findById(id)

    if( !pasajeroBDD ) return res.status(404).json({msg: `Lo sentimos, no existe el administrador ${id}`})

    if(pasajeroBDD.email != req.body.email )
    {
        const pasajeroBDDMail = await Pasajero.findOne({email:req.body.email})

        if( pasajeroBDDMail)
        {
            return res.status(404).json({msg: "Lo sentimos, el correo ya se encuentra registrado"})
        }
    }

    pasajeroBDD.pasajeroName = req.body.pasajeroName
    pasajeroBDD.pasajeroLastName = req.body.pasajeroLastName
    pasajeroBDD.email = req.body.email
    pasajeroBDD.phone = req.body.phone

    await pasajeroBDD.save()

    res.status(200).json({msg: "Perfil del pasajero actualizado correctamente!"})
}


const actualizarPassword = async (req, res) => {
    const pasajeroBDD = await Pasajero.findById(req.pasajeroBDD._id)

    if( !pasajeroBDD ) return res.status(404).json({msg:`Lo sentimos, no existe el pasajero: ${id}`})

    const verificarPassword = await pasajeroBDD.matchPassword(req.body.passwordactual)

    if( !verificarPassword ) return res.status(404).json({msg: "Lo sentimos, el password actual no es el correcto"})

    pasajeroBDD.password = await pasajeroBDD.encrypPassword(req.body.passwordnuevo)

    await pasajeroBDD.save()

    res.status(200).json({msg: "Password actualizado correctamente"})
}


const recuperarPassword = async(req, res) => {
    const { email } = req.body

    if(Object.values(req.body).includes(""))  return res.status(404).json({msg: "Lo sentimos, debes de llenar todos los campos"})

    const pasajeroBDD = await Pasajero.findOne({email})

    if( !pasajeroBDD ) return res.status(404).json({msg: "Lo sentimos, el usuario no se encuentra registrado"})

    const token = pasajeroBDD.crearToken()

    pasajeroBDD.token = token

    await sendMailToRecoveryPassword(email, token)

    await pasajeroBDD.save()

    res.status(200).json({msg: "REvisa tu correo electronico para restablecer tu cuenta"})
}


const comprobarTokenPassword = async (req, res) => {
    if( !(res.params.token)) return res.status(404).json({msg: "Lo sentimos, no se puede validar la cuenta"})

    const pasajeroBDD = await Pasajero.findOne({token:req.params.token})

    if(pasajeroBDD?.token !== req.params.token) return res.status(404).json({msg: "Lo sentimos, no se puede validar la cuentaa"})

    await pasajeroBDD.save()

    res.status(200).json({msg: "Token confirmado, ya puedes crear tu nuevo password"})
}


const nuevoPassword = async (req, res) => {
    const { password, confirmPassword } = req.body

    if( Object.values(req.body).includes("") ) return res.status(404).json({msg: "Lo sentimos, debs llenar todos los campos"})

    if( password != confirmPassword ) return res.status(404).json({msg: "Lo sentimos, los password no coinciden"})

    const pasajeroBDD = await Pasajero.findOne({token:req.params.token})

    if( pasajeroBDD?.token !== req.params.token) return res.status(404).json({msg: "Lo sentimos, no se puede validar la cuenta"})

    pasajeroBDD.token = null

    pasajeroBDD.password = await pasajeroBDD.encrypPassword(password)

    await pasajeroBDD.save()

    res.status(200).json({msg: "Felicidades, ya puedes iniciar sesion con tu nuevo password"})
}


export {
    login,
    perfil,
    confirmEmail,
    listarPasajeros,
    detallePasajero,
    actualizarPerfil,
    actualizarPassword,
    recuperarPassword,
    comprobarTokenPassword,
    nuevoPassword
}