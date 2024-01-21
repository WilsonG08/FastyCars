import Conductor from '../models/conductorDB.js'
import mongoose from 'mongoose';
import generarJWT from "../helpers/crearJWT.js";
import Boleto from '../models/reservaDB.js'

import {
    sendMailToRecoveryPasswordChofer
} from "../config/nodemailer.js";


const detalleChofer =  async( req, res ) =>{
    const { id } = req.params

    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg: `Lo sentimos, debe ser un Id vlaido: ${id}`})

    const conductorBDD = await Conductor.findById(id).select("-password")

    if( !conductorBDD ) return res.status(404).json({msg: `Lo sentimos, no existe el pasajero con el ID: ${id}`})

    res.status(200).json({msg: conductorBDD})
}



const actualizarChofer = async (req, res) => {
    try {
        // Extrae el ID del chofer de la URL
        const { id } = req.params;

        // Verifica si el ID es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ msg: `Lo sentimos, debe ser un id válido: ${id}` });
        }

        // Verifica si el ID del usuario coincide con el ID del chofer
        if (req.choferBDD._id.toString() !== id) {
            return res.status(403).json({ msg: `Acceso denegado` });
        }

        // Actualiza la información del perfil y genera un nuevo token
        const choferBDD = await Conductor.findByIdAndUpdate(
            id,
            {
                choferNombre: req.body.choferNombre,
                choferApellido: req.body.choferApellido,
                phone: req.body.phone,
            },
            {
                new: true,
            }
        );

        // Verifica si se encontró al chofer
        if (!choferBDD) {
            return res.status(403).json({ msg: `Acceso denegado` });
        }

        // Genera un nuevo token
        choferBDD.crearToken();
        await choferBDD.save();

        res.status(200).json({ msg: "Perfil de conductor actualizado correctamente", choferBDD });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al actualizar el perfil de conductor" });
    }
};



const confirmEmail = async (req,res) => {
    if( !(req.params.token) ) return res.status(400).json({msg: "Lo sentimos, no se puede validar la cuenta"})

    const choferBDD = await Conductor.findOne({token:req.params.token})

    if( !choferBDD?.token ) return res.status(404).json({msg: "La cuenta ya ha sido confirmada conductor"})

    choferBDD.token = null

    choferBDD.confirmEmail = true

    await choferBDD.save()

    res.status(200).json({msg: "Token cofirmado, ya puedes iniciar sesion querido conductor"})
}

// esta funcion no tiene que ir 
const eliminarChofer = async(req, res) => {
    const { id } = req.params

    if( Object.values(req.body).includes("")) return res.status(400).json({msg: "Lo sentimos, debes llenar todos los campos"})

    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg: `Lo sentimos, no existe el Conductor ${id}`})

    // duda, no va esta linea
    const { salida } = req.body

    await Conductor.findByIdAndUpdate(req.params.id,{salida: Date.parse(salida),estado:false})

    res.status(200).json({msg: "Fecha de salida"})
}


const actualizarPassword = async (req, res) => {

    const choferBDD = await Conductor.findById(req.choferBDD._id)

    if (!choferBDD) return res.status(404).json({ msg: `Lo sentimos, no existe el conductor ${id}` })

    const verificarPassword = await choferBDD.matchPassword(req.body.passwordactual)

    if (!verificarPassword) return res.status(404).json({ msg: "Lo sentimos, la contraseña actual no es la correcta" })

    choferBDD.password = await choferBDD.encrypPassword(req.body.passwordnuevo)

    await choferBDD.save()

    res.status(200).json({ msg: "¡La contraseña se ha actualizado correctamente!" })
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

    res.status(200).json({ msg: "Por favor, revisa tu correo electrónico para restablecer tu cuenta." })
}



const comprobarTokenPassword = async (req, res) => {
    if (!(req.params.token)) return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" })

    const choferBDD = await Conductor.findOne({ token: req.params.token })

    if (choferBDD?.token !== req.params.token) return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" })

    await choferBDD.save()

    res.status(200).json({ msg: "Token confirmado, ya puedes crear tu nueva contraseña" })
}


const nuevoPassword = async (req, res) => {

    const { password, confirmpassword } = req.body

    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" })

    if (password != confirmpassword) return res.status(404).json({ msg: "Lo sentimos, los passwords no coinciden!" })

    const choferBDD = await Chofer.findOne({ token: req.params.token })

    if (choferBDD?.token !== req.params.token) return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" })

    choferBDD.token = null

    choferBDD.password = await choferBDD.encrypPassword(password)

    await choferBDD.save()

    res.status(200).json({ msg: "Felicidades, ya puedes iniciar sesión con tu nueva contraseña" })
}




const verViajesAsignados = async (req, res) => {
    try {
        const { idConductor } = req.body;

        // Validar si idConductor es una cadena válida ObjectId
        if (!mongoose.Types.ObjectId.isValid(idConductor)) {
            return res.status(400).json({ error: 'ID de conductor no válido' });
        }

        // Convertir la cadena a ObjectId
        const conductorObjectId = new mongoose.Types.ObjectId(idConductor);

        // Obtener los boletos asignados al conductor cuyo estadoPax es 'Aprobado'
        const boletos = await Boleto.find({ conductorAsignado: conductorObjectId, estadoPax: 'Aprobado' })
            .select('tipoBoleto user ciudadSalida ciudadLlegada turno numPax precio estadoPax -_id');

        // Verificar si se encontraron boletos
        if (boletos.length > 0) {
            // Enviar respuesta con los boletos asignados
            res.status(200).json({ mensaje: 'Viajes asignados', boletos });
        } else {
            // Enviar respuesta de error si no se encontraron boletos
            res.status(400).json({ error: 'No se encontraron viajes asignados' });
        }
    } catch (error) {
        // Manejar errores
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}




const actualizarEstadoCompartido = async (req, res) => {
    try {
        const { idBoleto, idConductor, nuevoEstado } = req.body;

        // Validar si idBoleto es una cadena válida ObjectId
        if (!mongoose.Types.ObjectId.isValid(idBoleto)) {
            return res.status(400).json({ error: 'ID de boleto no válido' });
        }

        // Convertir la cadena a ObjectId
        const boletoObjectId = new mongoose.Types.ObjectId(idBoleto);

        // Obtener el boleto y el conductor
        const boleto = await Boleto.findById(boletoObjectId);
        const conductor = await Conductor.findById(idConductor);

        // Verificar si el boleto y el conductor son válidos
        if (boleto && conductor) {
            // Verificar si el estado del pasajero no está ya 'Completado'
            if (boleto.estadoPax !== 'Completado') {
                // Verificar si el nuevoEstado es 'En tránsito' o 'Completado'
                if (['En tránsito', 'Completado'].includes(nuevoEstado)) {
                    // Actualizar el estado del pasajero
                    boleto.estadoPax = nuevoEstado;
                    await boleto.save();

                    // Si el estado es 'Completado', actualizar los asientos ocupados del conductor
                    if (nuevoEstado === 'Completado') {
                        conductor.asientosOcupados -= boleto.numPax;
                        await conductor.save();
                    }

                    // Enviar respuesta exitosa
                    res.status(200).json({ mensaje: 'Viaje actualizado con éxito' });
                } else {
                    // Enviar respuesta de error si el nuevoEstado no es 'En tránsito' o 'Completado'
                    res.status(400).json({ error: 'Estado no permitido' });
                }
            } else {
                // Enviar respuesta de error si el estado del pasajero ya está 'Completado'
                res.status(400).json({ error: 'El viaje ya ha sido finalizado' });
            }
        } else {
            // Enviar respuesta de error si el boleto o el conductor no son válidos
            res.status(400).json({ error: 'Error al actualizar el viaje' });
        }
    } catch (error) {
        // Manejar errores
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



export {
    detalleChofer,
    actualizarChofer,
    eliminarChofer,
    confirmEmail,
    actualizarPassword,
    recuperarPassword,
    comprobarTokenPassword,
    nuevoPassword,
    verViajesAsignados,
    actualizarEstadoCompartido,
    //verMiInformacion
}

