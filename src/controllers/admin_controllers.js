import Administrador from "../models/adminDB.js";
import Pasajero from '../models/pasajeroDB.js'
import Conductor from "../models/conductorDB.js";
import generarJWT from "../helpers/crearJWT.js";
import mongoose from "mongoose";
import Boleto from '../models/reservaDB.js'

import {
    sendMailToRecoveryPassword,
    sendMailToUserAdmin,
    sendMailToUserChofer,
    sendMailToRecoveryPasswordAdmin
} from "../config/nodemailer.js";


const registro = async (req, res) => {
    const { adminNombre, adminApellido, correo, password, phone } = req.body

    if (!adminNombre || !adminApellido || !correo || !password || !phone) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });

    const verificarcorreoBDDAdmin = await Administrador.findOne({ correo });
    const verificarcorreoBDDPasajero = await Pasajero.findOne({ correo });
    const verificarcorreoBDDConductor = await Conductor.findOne({ correo });

    if (verificarcorreoBDDAdmin || verificarcorreoBDDPasajero || verificarcorreoBDDConductor) return res.status(400).json({ msg: "Lo sentimos, el correo ya se encuentra registrado" });

    const nuevoAdmin = new Administrador(req.body);

    nuevoAdmin.password = await nuevoAdmin.encrypPassword(password);

    const token = nuevoAdmin.crearToken();

    await sendMailToUserAdmin(correo, token);

    await nuevoAdmin.save();

    res.status(200).json({
        msg: "Por favor, revisa tu correo electrónico. Hemos enviado un token para que confirmes tu cuenta de Administrador ¡Gracias! 😊"
    });
};


const confirmEmail = async (req, res) => {
    if (!req.params.token) return res.status(400).json({ msg: "Lo sentimos, no se puede validar la cuenta" });

    const administradorBDD = await Administrador.findOne({ token: req.params.token });

    if (!administradorBDD?.token) return res.status(404).json({ msg: "La cuenta ya ha sido confirmada como Administrador" });

    administradorBDD.token = null;

    administradorBDD.confirmEmail = true;

    await administradorBDD.save();

    res.status(200).json({
        msg: "Token de Administrador confirmado, ya puedes iniciar sesión",
    });
};


const perfil = (req, res) => {
    delete req.administradorBDD.token;
    delete req.administradorBDD.confirmEmail;
    delete req.administradorBDD.createdAt;
    delete req.administradorBDD.updateAt;
    delete req.administradorBDD.__v;
    res.status(200).json(req.administradorBDD);
};



const listarpasajeros = async (req, res) => {
    try {
         // Especifica los campos que deseas recuperar
        const pasajeros = await Pasajero.find({}, 'pasajeroNombre pasajeroApellido correo phone rol');

        res.status(200).json(pasajeros);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar los pasajeros' });
    }
};



const actualizarPerfil = async (req, res) => {
    try {
        // Extrae el ID del administrador de la URL
        const { id } = req.params;

        // Verifica si el ID es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ msg: `Lo sentimos, debe ser un id válido: ${id}` });
        }

        // Verifica si el ID del usuario coincide con el ID del administrador
        if (req.administradorBDD._id.toString() !== id) {
            return res.status(403).json({ msg: `Acceso denegado` });
        }


        // Actualiza la información del perfil y genera un nuevo token
        const administradorBDD = await Administrador.findByIdAndUpdate(
            id,
            {
                adminNombre: req.body.adminNombre,
                adminApellido: req.body.adminApellido,
                phone: req.body.phone,
            },
            {
                new: true,
            }
        );


        // Verifica si se encontró al administrador
        if (!administradorBDD) {
            return res.status(403).json({ msg: `Acceso denegado` });
        }

        // Genera un nuevo token
        administradorBDD.crearToken();
        await administradorBDD.save();

        res.status(200).json({ msg: "Perfil actualizado correctamente", administradorBDD });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al actualizar el perfil" });
    }
};




const actualizarPassword = async (req, res) => {

    const administradorBDD = await Administrador.findById(req.administradorBDD._id)

    if (!administradorBDD) return res.status(404).json({ msg: `Lo sentimos, no existe el administrador ${id}` })

    const verificarPassword = await administradorBDD.matchPassword(req.body.passwordactual)

    if (!verificarPassword) return res.status(404).json({ msg: "Lo sentimos, la contraseña actual no es la correcta" })

    administradorBDD.password = await administradorBDD.encrypPassword(req.body.passwordnuevo)

    await administradorBDD.save()

    res.status(200).json({ msg: "La contraseña actualizado correctamente!" })
}


const recuperarPassword = async (req, res) => {
    const { correo } = req.body;

    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" })

    const administradorBDD = await Administrador.findOne({ correo })

    if (!administradorBDD) return res.status(404).json({ msg: "Lo sentimos, el usuario no se encuentra registrado" })

    const token = administradorBDD.crearToken()

    administradorBDD.token = token

    await sendMailToRecoveryPasswordAdmin(correo, token)

    await administradorBDD.save()

    res.status(200).json({ msg: "Revisa tu correo electronico para reestablecer tu cuenta" })
}



const comprobarTokenPassword = async (req, res) => {
    if (!(req.params.token)) return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" })

    const administradorBDD = await Administrador.findOne({ token: req.params.token })

    if (administradorBDD?.token !== req.params.token) return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" })

    await administradorBDD.save()

    res.status(200).json({ msg: "Token confirmado, ya puedes crear tu nuevo password" })
}


const nuevoPassword = async (req, res) => {

    const { password, confirmpassword } = req.body

    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" })

    if (password != confirmpassword) return res.status(404).json({ msg: "Lo sentimos, las contraseña no coinciden!" })

    const administradorBDD = await Administrador.findOne({ token: req.params.token })

    if (administradorBDD?.token !== req.params.token) return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" })

    administradorBDD.token = null

    administradorBDD.password = await administradorBDD.encrypPassword(password)

    await administradorBDD.save()

    res.status(200).json({ msg: "Felicidades, ya puedes iniciar sesion con tu nueva contraseña" })
}








const obtenerAsientosDisponibles = async (req, res) => {
    try {
        const { idConductor } = req.body;

        // Obtener el conductor
        const conductor = await Conductor.findById(idConductor);

        // Verificar si el conductor es válido
        if (conductor) {
            // Obtener todos los boletos asignados al conductor
            const boletos = await Boleto.find({ conductorAsignado: conductor._id });

            // Sumar el número de pasajeros en todos los boletos
            let asientosOcupados = 0;
            for (let boleto of boletos) {
                asientosOcupados += boleto.numPax;
            }

            // Calcular los asientos disponibles
            const asientosDisponibles = conductor.numeroAsientos - asientosOcupados;

            // Enviar respuesta con los asientos disponibles y el nombre del conductor
            res.status(200).json({ mensaje: 'Asientos disponibles obtenidos con éxito', conductor: conductor.conductorNombre, asientosDisponibles: asientosDisponibles });
        } else {
            // Enviar respuesta de error si el conductor no es válido
            res.status(400).json({ error: 'Error al obtener los asientos disponibles' });
        }
    } catch (error) {
        // Manejar errores
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



const verViajesPendientes = async (req, res) => {
    try {
        // Obtener los boletos que no tienen conductor asignado y cuyo estado es 'Pendiente'
        const boletos = await Boleto.find({ conductorAsignado: null, estadoPax: 'Pendiente' });

        // Verificar si se encontraron boletos
        if (boletos.length > 0) {
            // Crear un nuevo array de boletos con solo los detalles que necesitas
            const boletosFiltrados = boletos.map(boleto => ({
                tipoBoleto: boleto.tipoBoleto,
                nombre: boleto.user.nombre,
                apellido: boleto.user.apellido,
                ciudadSalida: boleto.ciudadSalida.ciudad,
                ciudadLlegada: boleto.ciudadLlegada.ciudad,
                turno: boleto.turno,
                id: boleto._id,
                numPax: boleto.numPax
            }));
            
            // Enviar respuesta con los boletos pendientes
            res.status(200).json({ mensaje: 'Viajes pendientes', boletos: boletosFiltrados });
        } else {
            // Enviar respuesta de error si no se encontraron boletos
            res.status(400).json({ error: 'No se encontraron viajes pendientes' });
        }
    } catch (error) {
        // Manejar errores
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



export {
    registro,
    confirmEmail,
    perfil,
    listarpasajeros,
    actualizarPerfil,
    actualizarPassword,
    recuperarPassword,
    comprobarTokenPassword,
    nuevoPassword,
    verViajesPendientes,
    obtenerAsientosDisponibles,
};
