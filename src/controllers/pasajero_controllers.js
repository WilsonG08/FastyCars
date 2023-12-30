import Pasajero from '../models/pasajeroDB.js'
import Administrador from '../models/adminDB.js'
import Conductor from '../models/conductorDB.js'
import RutayHorario from '../models/ruta_horario.js'
import Servicio from '../models/serviciosDb.js'

import { sendMailToUser, sendMailToRecoveryPassword } from "../config/nodemailer.js"
import generarJWT from "../helpers/crearJWT.js"
import mongoose from "mongoose";


const login = async(req, res) => {
    const { correo, password } = req.body

    if( Object.values(req.body).includes("") ) return res.status(404).json({msg: "Lo sentimos, debes llenar todos los campos"})

    let usuarioBDD = await Administrador.findOne({correo}).select("-status -__v -token -updatedAt -createdAt");

    if (!usuarioBDD) {
        usuarioBDD = await Conductor.findOne({correo}).select("-status -__v -token -updatedAt -createdAt");
    }

    if (!usuarioBDD) {
        usuarioBDD = await Pasajero.findOne({correo}).select("-status -__v -token -updatedAt -createdAt");
    }

    if( usuarioBDD?.confirmEmail === false ) return res.status(403).json({msg: "Lo sentimos, debe verificar su cuenta"})

    if ( !usuarioBDD ) return res.status(404).json({result:false,msg: "Lo sentimos, el usuario no se encuentra regitrado"})

    const verificarPassword = await usuarioBDD.matchPassword(password)

    if( !verificarPassword ) return res.status(404).json({msg: "Lo sentimos, el password no es correcto"})

    const token = generarJWT(usuarioBDD._id, usuarioBDD.rol)

    const { nombre, apellido, phone, _id, rol } = usuarioBDD

    res.status(200).json({
        result:true,
        token,
        nombre,
        apellido,
        phone,
        _id,
        rol,
        correo:usuarioBDD.correo
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



const registro = async (req, res) => {
    const { pasajeroNombre, pasajeroApellido, correo, password, phone } = req.body
    
    if (!pasajeroNombre || !pasajeroApellido || !correo || !password || !phone) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });

    const verificarcorreoBDD = await Pasajero.findOne({correo})

    if(verificarcorreoBDD) return res.status(400).json({msg: "Lo sentimos, el correo ya se encuentra registrado"})

    const nuevoPasajero = new Pasajero(req.body)

    nuevoPasajero.password = await nuevoPasajero.encrypPassword(password)

    const token = nuevoPasajero.crearToken()

    await sendMailToUser(correo,token)

    await nuevoPasajero.save()

    res.status(200).json({msg: "Revisa tu correo electronico para confirmar tu cuenta PASAJERO"})
}



const confirmEmail = async (req,res) => {
    if( !(req.params.token) ) return res.status(400).json({msg: "Lo sentimos, no se puede validar la cuenta"})

    const pasajeroBDD = await Pasajero.findOne({token:req.params.token})

    if( !pasajeroBDD?.token ) return res.status(404).json({msg: "La cuenta ya ha sido confirmada como PASAJERO"})

    pasajeroBDD.token = null

    pasajeroBDD.confirmEmail = true

    await pasajeroBDD.save()

    res.status(200).json({msg: "Token cofirmado, ya puedes iniciar sesion!"})
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

    if(pasajeroBDD.correo != req.body.correo )
    {
        const pasajeroBDDMail = await Pasajero.findOne({correo:req.body.correo})

        if( pasajeroBDDMail)
        {
            return res.status(404).json({msg: "Lo sentimos, el correo ya se encuentra registrado"})
        }
    }

    pasajeroBDD.pasajeroNombre = req.body.pasajeroNombre
    pasajeroBDD.pasajeroApellido = req.body.pasajeroApellido
    pasajeroBDD.correo = req.body.correo
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
    const { correo } = req.body

    if(Object.values(req.body).includes(""))  return res.status(404).json({msg: "Lo sentimos, debes de llenar todos los campos"})

    const pasajeroBDD = await Pasajero.findOne({correo})

    if( !pasajeroBDD ) return res.status(404).json({msg: "Lo sentimos, el usuario no se encuentra registrado"})

    const token = pasajeroBDD.crearToken()

    pasajeroBDD.token = token

    await sendMailToRecoveryPassword(correo, token)

    await pasajeroBDD.save()

    res.status(200).json({msg: "REvisa tu correo electronico para restablecer tu cuenta"})
}


const comprobarTokenPassword = async (req, res) => {
    if( !(req.params.token)) return res.status(404).json({msg: "Lo sentimos, no se puede validar la cuenta"})

    const pasajeroBDD = await Pasajero.findOne({token:req.params.token})

    if(pasajeroBDD?.token !== req.params.token) return res.status(404).json({msg: "Lo sentimos, no se puede validar la cuentaa"})

    await pasajeroBDD.save()

    res.status(200).json({msg: "Token confirmado, ya puedes crear tu nuevo password"})
}


const nuevoPassword = async (req, res) => {
    const { password, confirmpassword } = req.body

    if( Object.values(req.body).includes("") ) return res.status(404).json({msg: "Lo sentimos, debs llenar todos los campos"})

    if( password != confirmpassword ) return res.status(404).json({msg: "Lo sentimos, los password no coinciden"})

    const pasajeroBDD = await Pasajero.findOne({token:req.params.token})

    if( pasajeroBDD?.token !== req.params.token) return res.status(404).json({msg: "Lo sentimos, no se puede validar la cuenta"})

    pasajeroBDD.token = null

    pasajeroBDD.password = await pasajeroBDD.encrypPassword(password)

    await pasajeroBDD.save()

    res.status(200).json({msg: "Felicidades, ya puedes iniciar sesion con tu nuevo password"})
}


const serviciosDsiponibles = async (req, res) => {
    try {
        const servicios = await Servicio.find().select('nombreServicio detalleServicio valorEstimado');
        res.status(200).json(servicios);
    } catch (error) {
        res.status(500).json({ msg: "Hubo un error al obtener las rutas", error });
    }
}


// OBTENER LAS RUTAS Y HORARIOS
const obtenerRutasHorarios = async (req, res) => {
    try {
        const rutas = await RutayHorario.find();
        res.status(200).json(rutas);
    } catch (error) {
        res.status(500).json({ msg: "Hubo un error al obtener las rutas", error });
    }
};

const verConductorAsignado = async (req, res) => {
    try {
        const { idBoleto } = req.body;

        // Validar si idBoleto es una cadena válida ObjectId
        if (!mongoose.Types.ObjectId.isValid(idBoleto)) {
            return res.status(400).json({ error: 'ID de boleto no válido' });
        }

        // Convertir la cadena a ObjectId
        const boletoObjectId = new mongoose.Types.ObjectId(idBoleto);

        // Obtener el boleto
        const boleto = await Boleto.findById(boletoObjectId).populate('conductorAsignado');

        // Verificar si el boleto es válido
        if (boleto && boleto.conductorAsignado) {
            // Crear un objeto con solo los detalles del conductor que necesitas
            const conductor = {
                nombre: boleto.conductorAsignado.conductorNombre,
                apellido: boleto.conductorAsignado.conductorApellido,
                celular: boleto.conductorAsignado.phone,
                marca: boleto.conductorAsignado.marcaVehiculo,
                modelo: boleto.conductorAsignado.modeloVehiculo,
                color: boleto.conductorAsignado.colorVehiculo,
                placa: boleto.conductorAsignado.placaVehiculo
            };

            // Enviar respuesta con los detalles del conductor
            res.status(200).json({ mensaje: 'Conductor asignado', conductor });
        } else {
            // Enviar respuesta de error si el boleto no es válido
            res.status(400).json({ error: 'Error al obtener el conductor asignado' });
        }
    } catch (error) {
        // Manejar errores
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export {
    login,
    perfil,
    registro,
    confirmEmail,
    detallePasajero,
    actualizarPerfil,
    actualizarPassword,
    recuperarPassword,
    comprobarTokenPassword,
    nuevoPassword,
    serviciosDsiponibles,
    obtenerRutasHorarios,
    verConductorAsignado
}