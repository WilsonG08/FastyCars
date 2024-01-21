import Conductor from '../models/conductorDB.js';
import Pasajero from '../models/pasajeroDB.js';
import Administrador from '../models/adminDB.js';
import mongoose from "mongoose";


// Para el envio de correo 
import {
    sendMailToUserChofer,
} from "../config/nodemailer.js";


const registrarChofer = async (req, res) => {
    // Verify if the authenticated user is an administrator
    if (req.rol !== 'administrador') {
        return res.status(403).json({ msg: 'Acceso denegado. Solo los usuarios con rol de Administrador tienen permiso para esta operación.' });
    }


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
        !Number.isInteger(numeroAsientos) ||
        numeroAsientos < 1 ||
        numeroAsientos > 4 ||
        numeroAsientos < 0
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

    // Verificar la inscripción de cedulas duplicadas
    const existingChoferWithCedula = await Conductor.findOne({ cedula });
    if (existingChoferWithCedula) {
        return res.status(400).json({
            msg: 'La cédula ya está registrada para otro chofer',
        });
    }

    const verificarcorreoBDDAdmin = await Administrador.findOne({ correo });
    const verificarcorreoBDDPasajero = await Pasajero.findOne({ correo });
    const verificarcorreoBDDConductor = await Conductor.findOne({ correo });

    if (verificarcorreoBDDAdmin || verificarcorreoBDDPasajero || verificarcorreoBDDConductor) return res.status(400).json({ msg: "Lo sentimos, el correo ya se encuentra registrado" });

    const nuevoChofer = new Conductor(req.body);

    // Asignar el ID del administrador al campo 'administrador' del nuevo conductor
    nuevoChofer.administrador = req.administradorBDD._id; // Asegúrate de que 'req.userId' contiene el ID del administrador

    nuevoChofer.password = await nuevoChofer.encrypPassword(password);

    const token = nuevoChofer.crearToken();

    await nuevoChofer.save();

    try {
        await sendMailToUserChofer(correo, token);
    } catch (error) {
        console.error('Error enviando correo electrónico de confirmación:', error);
    }


    res.status(200).json({
        msg: 'Revisa tu correo electrónico para confirmar tu cuenta de chofer',
    });
};



const listarChoferes = async (req, res) => {

    // Verify if the authenticated user is an administrator
    if (req.rol !== 'administrador') {
        return res.status(403).json({ msg: 'Acceso denegado. Solo los usuarios con rol de Administrador tienen permiso para esta operación.' });
    }

    try {
        // Especifica los campos que deseas recuperar
        const choferes = await Conductor.find({}, 'conductorNombre conductorApellido correo phone rol');

        res.status(200).json(choferes);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar los choferes' });
    }
};



const obtenerChoferPorId = async (req, res) => {

    // Verify if the authenticated user is an administrator
    if (req.rol !== 'administrador') {
        return res.status(403).json({ msg: 'Acceso denegado. Solo los usuarios con rol de Administrador tienen permiso para esta operación.' });
    }


    try {
        const id = req.params.id;
        const chofer = await Conductor.findById(id, 'conductorNombre conductorApellido correo phone rol');

        if (!chofer) {
            return res.status(404).json({ error: 'No se encontró un conductor con ese ID' });
        }

        res.status(200).json(chofer);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el conductor' });
    }
};


const eliminarChoferPorId = async (req, res) => {

    if (req.rol !== 'administrador') {
        return res.status(403).json({ msg: 'Acceso denegado. Solo los usuarios con rol de Administrador tienen permiso para esta operación.' });
    }

    try {
        const id = req.params.id;
        const chofer = await Conductor.findByIdAndRemove(id);

        if (!chofer) {
            return res.status(404).json({ msg: 'No se encontró un conductor con ese ID' });
        }

        res.status(200).json({ msg: 'Conductor eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar el conductor' });
    }
};


const actualizarChoferAdmin = async (req, res) => {

    if (req.rol !== 'administrador') {
        return res.status(403).json({ msg: 'Acceso denegado. Solo los usuarios con rol de Administrador tienen permiso para esta operación.' });
    }

    try {
        // Extrae el ID del chofer de la URL
        const { id } = req.params;

        // Verifica si el ID es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ msg: `Lo sentimos, debe ser un id válido: ${id}` });
        }

        // Actualiza la información del perfil y genera un nuevo token
        const choferBDD = await Conductor.findByIdAndUpdate(
            id,
            {
                conductorNombre: req.body.conductorNombre,
                conductorApellido: req.body.conductorApellido,
                cedula: req.body.cedula,
                phone: req.body.phone,
                numeroAsientos: req.body.numeroAsientos,
                placaVehiculo: req.body.placaVehiculo,
                marcaVehiculo: req.body.marcaVehiculo,
                modeloVehiculo: req.body.modeloVehiculo,
                anioVehiculo: req.body.anioVehiculo,
                colorVehiculo: req.body.colorVehiculo,
            },
            {
                new: true,
            }
        );

        // Verifica si se encontró al chofer
        if (!choferBDD) {
            return res.status(403).json({ msg: `Conductor no encontrado!` });
        }

        res.status(200).json({ msg: "Perfil de conductor actualizado correctamente", choferBDD });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al actualizar el perfil de conductor" });
    }
};







export {
    registrarChofer,
    listarChoferes,
    obtenerChoferPorId,
    eliminarChoferPorId,
    actualizarChoferAdmin
}