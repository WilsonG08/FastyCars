import Administrador from "../models/adminDB.js";
import Conductor from "../models/conductorDB.js";
import generarJWT from "../helpers/crearJWT.js";
import mongoose from "mongoose";
import Pasajero from '../models/pasajeroDB.js'
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

    const verificarcorreoBDD = await Administrador.findOne({ correo });

    if (verificarcorreoBDD) return res.status(400).json({ msg: "Lo sentimos, el correo ya se encuentra registrado" });

    const nuevoAdmin = new Administrador(req.body);

    nuevoAdmin.password = await nuevoAdmin.encrypPassword(password);

    const token = nuevoAdmin.crearToken();

    await sendMailToUserAdmin(correo, token);

    await nuevoAdmin.save();

    res.status(200).json({
        msg: "Revisa tu correo electronico para confirmar tu cuenta ADMINISTRADOR",
    });
};

const confirmEmail = async (req, res) => {
    if (!req.params.token) return res.status(400).json({ msg: "Lo sentimos, no se puede validar la cuenta" });

    const administradorBDD = await Administrador.findOne({ token: req.params.token });

    if (!administradorBDD?.token) return res.status(404).json({ msg: "La cuenta ya ha sido confirmada como ADMINISTRADOR" });

    administradorBDD.token = null;

    administradorBDD.confirmEmail = true;

    await administradorBDD.save();

    res.status(200).json({
        msg: "Token de administrador confirmado, ya puedes iniciar sesión",
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


const listarChoferes = async (req, res) => {
    try {
        const choferes = await Chofer.find({}, 'conductorNombre conductorApellido correo phone rol'); // Especifica los campos que deseas recuperar

        res.status(200).json(choferes);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar los choferes' });
    }
};


const listarpasajeros = async (req, res) => {
    try {
        const pasajeros = await Pasajero.find({}, 'pasajeroNombre pasajeroApellido correo phone rol'); // Especifica los campos que deseas recuperar

        res.status(200).json(pasajeros);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar los pasajeros' });
    }
};



const detalleChofer = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: `Lo sentimos, debe ser un id válido` });

    const administradorBDD = await Administrador.findById(id).select("-password");

    if (!administradorBDD) return res.status(404).json({ mgs: `Lo sentimos, no existe el chofer ${id}` });

    res.status(200).json({ msg: administradorBDD });
};



const detallePasjero = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: `Lo sentimos, debe ser un id válido` });

    const administradorBDD = await Administrador.findById(id).select("-password");

    if (!administradorBDD) return res.status(404).json({ mgs: `Lo sentimos, no existe el chofer ${id}` });

    res.status(200).json({ msg: administradorBDD });
};



const actualizarPerfil = async (req, res) => {
    try {
        // Obtiene el ID del usuario que inició sesión
        const usuarioActual = req.administradorBDD;

        // Actualiza la información del perfil
        const administradorBDD = await Administrador.findByIdAndUpdate(
            usuarioActual._id,
            {
                adminNombre: req.body.adminNombre || usuarioActual.adminNombre,
                adminApellido: req.body.adminApellido || usuarioActual.adminApellido
            },
            {
                new: true,
            }
        );

        // Genera y almacena un nuevo token
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

    if (!verificarPassword) return res.status(404).json({ msg: "Lo sentimos, el password actual no es el correcto" })

    administradorBDD.password = await administradorBDD.encrypPassword(req.body.passwordnuevo)

    await administradorBDD.save()

    res.status(200).json({ msg: "Password actualizado correctamente!" })
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

    if (password != confirmpassword) return res.status(404).json({ msg: "Lo sentimos, los passwords no coinciden!" })

    const administradorBDD = await Administrador.findOne({ token: req.params.token })

    if (administradorBDD?.token !== req.params.token) return res.status(404).json({ msg: "LO sentimos, no se puede validar la cuenta" })

    administradorBDD.token = null

    administradorBDD.password = await administradorBDD.encrypPassword(password)

    await administradorBDD.save()

    res.status(200).json({ msg: "Felicidades, ya puedes iniciar sesion con tu nuevo password" })
}



const registrarChofer = async (req, res) => {
    // Verify if the authenticated user is an administrator
    if (req.rol !== 'administrador') return res.status(403).json({ msg: 'Acceso no autorizado' });

    const {
        conductorNombre, conductorApellido, cedula, correo, password, phone, numeroAsientos,
        placaVehiculo, marcaVehiculo, modeloVehiculo, anioVehiculo, colorVehiculo,
    } = req.body;

    if (
        !conductorNombre ||
        !conductorApellido ||
        !correo ||
        !password ||
        !phone ||
        !cedula ||
        isNaN(numeroAsientos) ||
        !Number.isInteger(numeroAsientos) ||  // Verifica si es un número entero
        numeroAsientos < 1 ||
        numeroAsientos > 4
    ) {
        return res.status(400).json({
            msg: 'Debes llenar todos los campos: nombre, apellido, correo electrónico, contraseña, número de teléfono y número de asientos (debe ser un número entero entre 1 y 4)',
        });
    }



    // Validación de cedula
    if (!req.body.cedula) {
        return res.status(400).json({ msg: "El campo 'cedula' es obligatorio" });
    }

    // Validar la información del vehículo
    if (!placaVehiculo || !marcaVehiculo || !modeloVehiculo || !anioVehiculo || !colorVehiculo) {
        return res.status(400).json({
            msg: 'Debes llenar todos los campos de información del vehículo: placa, marca, modelo, año y color',
        });
    }

    // Verificar la inscripción de vehículos duplicados
    const existingChoferWithPlate = await Conductor.findOne({ placaVehiculo });
    if (existingChoferWithPlate) {
        return res.status(400).json({
            msg: 'La placa del vehículo ya está registrada para otro chofer',
        });
    }

    const verificarcorreoBDDChofer = await Conductor.findOne({ correo });

    if (verificarcorreoBDDChofer) {
        return res.status(400).json({
            msg: 'Lo sentimos, el correo electrónico ya se encuentra registrado para otro chofer',
        });
    }

    const nuevoChofer = new Conductor(req.body);

    nuevoChofer.password = await nuevoChofer.encrypPassword(password);

    const token = nuevoChofer.crearToken();

    //await sendMailToUserChofer(correo, token);

    try {
        await sendMailToUserChofer(correo, token);
    } catch (error) {
        console.error('Error enviando correo electrónico de confirmación:', error);
    }

    await nuevoChofer.save();

    res.status(200).json({
        msg: 'Revisa tu correo electrónico para confirmar tu cuenta de chofer',
    });
};


/* 
const asignarConductor = async (req, res) => {
    try {
        const { idBoleto, idConductor } = req.body;

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
            // Obtener todos los boletos asignados al conductor
            const boletos = await Boleto.find({ conductorAsignado: conductor._id });

            // Sumar el número de pasajeros en todos los boletos
            let pasajerosAsignados = 0;
            for (let boleto of boletos) {
                pasajerosAsignados += boleto.numPax;
            }

            // Verificar si hay suficientes asientos disponibles
            if (conductor.numeroAsientos - pasajerosAsignados >= boleto.numPax) {
                // Actualizar el boleto con el conductor asignado
                boleto.conductorAsignado = conductor._id;
                await boleto.save();

                // Actualizar el estado del conductor
                conductor.estado = 'Ocupado';
                await conductor.save();

                // Enviar respuesta exitosa
                res.status(200).json({ mensaje: 'Conductor asignado con éxito' });
            } else {
                // Enviar respuesta de error si no hay suficientes asientos
                res.status(400).json({ error: 'No hay suficientes asientos disponibles' });
            }
        } else {
            // Enviar respuesta de error si el boleto o el conductor no son válidos
            res.status(400).json({ error: 'Error en la asignación de conductor' });
        }
    } catch (error) {
        // Manejar errores
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

*/

/* 
const asignarConductor = async (req, res) => {
    try {
        const { idBoleto, idConductor } = req.body;

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
            // Obtener todos los boletos asignados al conductor
            const boletos = await Boleto.find({ conductorAsignado: conductor._id });

            // Sumar el número de pasajeros en todos los boletos
            let pasajerosAsignados = 0;
            for (let boleto of boletos) {
                pasajerosAsignados += boleto.numPax;
            }

            // Verificar si hay suficientes asientos disponibles
            if (conductor.numeroAsientos - pasajerosAsignados >= boleto.numPax) {
                // Actualizar el boleto con el conductor asignado y cambiar el estado del pasajero
                boleto.conductorAsignado = conductor._id;
                boleto.estadoPax = 'Aprobado';
                await boleto.save();

                // Actualizar el estado del conductor
                conductor.estado = 'Ocupado';
                await conductor.save();

                // Enviar respuesta exitosa
                res.status(200).json({ mensaje: 'Conductor asignado con éxito' });
            } else {
                // Enviar respuesta de error si no hay suficientes asientos
                res.status(400).json({ error: 'No hay suficientes asientos disponibles' });
            }
        } else {
            // Enviar respuesta de error si el boleto o el conductor no son válidos
            res.status(400).json({ error: 'Error en la asignación de conductor' });
        }
    } catch (error) {
        // Manejar errores
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

 */

const asignarConductor = async (req, res) => {
    try {
        const { idBoleto, idConductor } = req.body;

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
            // Verificar si el campo conductorAsignado del boleto está vacío
            if (!boleto.conductorAsignado) {
                // Obtener todos los boletos asignados al conductor
                const boletos = await Boleto.find({ conductorAsignado: conductor._id });

                // Sumar el número de pasajeros en todos los boletos
                let pasajerosAsignados = 0;
                for (let boleto of boletos) {
                    pasajerosAsignados += boleto.numPax;
                }

                // Verificar si hay suficientes asientos disponibles
                if (conductor.numeroAsientos - pasajerosAsignados >= boleto.numPax) {
                    // Actualizar el boleto con el conductor asignado y cambiar el estado del pasajero
                    boleto.conductorAsignado = conductor._id;
                    boleto.estadoPax = 'Aprobado';
                    await boleto.save();

                    // Actualizar el estado del conductor
                    conductor.estado = 'Ocupado';
                    await conductor.save();

                    // Enviar respuesta exitosa
                    res.status(200).json({ mensaje: 'Conductor asignado con éxito' });
                } else {
                    // Enviar respuesta de error si no hay suficientes asientos
                    res.status(400).json({ error: 'No hay suficientes asientos disponibles' });
                }
            } else {
                // Enviar respuesta de error si el campo conductorAsignado del boleto no está vacío
                res.status(400).json({ error: 'El boleto ya tiene un conductor asignado' });
            }
        } else {
            // Enviar respuesta de error si el boleto o el conductor no son válidos
            res.status(400).json({ error: 'Error en la asignación de conductor' });
        }
    } catch (error) {
        // Manejar errores
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
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
            let pasajerosAsignados = 0;
            for (let boleto of boletos) {
                pasajerosAsignados += boleto.numPax;
            }

            // Calcular los asientos disponibles
            const asientosDisponibles = conductor.numeroAsientos - pasajerosAsignados;

            // Enviar respuesta con los asientos disponibles
            res.status(200).json({ mensaje: 'Asientos disponibles obtenidos con éxito', asientosDisponibles: asientosDisponibles });
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
    listarChoferes,
    listarpasajeros,
    detalleChofer,
    detallePasjero,
    actualizarPerfil,
    actualizarPassword,
    recuperarPassword,
    comprobarTokenPassword,
    nuevoPassword,
    registrarChofer,
    asignarConductor,
    verViajesPendientes,
    obtenerAsientosDisponibles
};
