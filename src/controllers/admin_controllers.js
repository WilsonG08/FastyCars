import Administrador from "../models/adminDB.js";
import Chofer from "../models/conductorDB.js";
import generarJWT from "../helpers/crearJWT.js";
import mongoose from "mongoose";
import Pasajero from '../models/pasajeroDB.js'


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

const confirmcorreo = async (req, res) => {
    if (!req.params.token) return res.status(400).json({ msg: "Lo sentimos, no se puede validar la cuenta" });

    const administradorBDD = await Administrador.findOne({ token: req.params.token });

    if (!administradorBDD?.token) return res.status(404).json({ msg: "La cuenta ya ha sido confirmada como ADMINISTRADOR" });

    administradorBDD.token = null;

    administradorBDD.confirmcorreo = true;

    await administradorBDD.save();

    res.status(200).json({
        msg: "Token de administrador confirmado, ya puedes iniciar sesión",
    });
};

const login = async (req, res) => {
    const { correo, password } = req.body;

    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" });

    const administradorBDD = await Administrador.findOne({ correo }).select("-status -__v -token -updatedAt -createdAt");

    if (administradorBDD?.confirmcorreo == false) return res.status(403).json({ msg: "Lo sentimos, debs de verificar su cuenta" });

    if (!administradorBDD) return res.status(404).json({ msg: "Lo sentimo, el administrador no se encuentra resgistrado" });

    const verificarPassword = await administradorBDD.matchPassword(password);

    if (!verificarPassword) return res.status(404).json({ msg: "Lo sentimos, el password no es el correcto" });

    // Asignacion del ROL
    const token = generarJWT(administradorBDD._id, "administrador");

    const { adminNombre, adminApellido, phone, _id } = administradorBDD;

    res.status(200).json({
        token,
        adminNombre,
        adminApellido,
        phone,
        _id,
        correo: administradorBDD.correo,
    });
};

const perfil = (req, res) => {
    delete req.administradorBDD.token;
    delete req.administradorBDD.confirmcorreo;
    delete req.administradorBDD.createdAt;
    delete req.administradorBDD.updateAt;
    delete req.administradorBDD.__v;
    res.status(200).json(req.administradorBDD);
};


/* 
const listarChoferes = (req, res) => {
    res.status(200).json({ res: "Lista de choferes registrados" });
};

*/

const listarChoferes = async (req, res) => {
    try {
        const choferes = await Chofer.find({}, 'conductorNombre conductorApellido correo phone rol'); // Especifica los campos que deseas recuperar

        res.status(200).json(choferes);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar los choferes' });
    }
};


/* 
const listarpasajeros = (req, res) => {
    res.status(200).json({ res: "Lista de pasajeros registrados" });
}; */

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


/* 

const actualizarPerfil = async (req, res) => {
    const { id } = req.params

    //if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});

//    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})

    const administradorBDD = await Administrador.findById(id)

//    if(!administradorBDD) return res.status(404).json({msg: `Lo sentimos, no existe el administrador ${id}`})

    if(administradorBDD.correo != req.body.correo)
    {
        const administradorBDDMail = await Administrador.findOne({correo:req.body.correo})
        
        if(administradorBDDMail)
        {
            return res.status(404).json({msg: `Lo sentimos, ya se encuentra registrado`})
        }
    }

    administradorBDD.adminNombre = req.body.adminNombre || administradorBDD?.adminNombre
    administradorBDD.adminApellido = req.body.adminApellido || administradorBDD?.adminApellido
    //administradorBDD.correo = req.body.correo || administradorBDD?.correo
    //administradorBDD.phone = req.body.phone || administradorBDD?.phone

    await administradorBDD.save()

    res.status(200).json({msg: "Perfil actualizado correctamente"})
};

 */



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



/* 
const registrarChofer = async (req, res) => {

    // Verifica si el usuario autenticado es un administrador
    if (req.rol !== 'administrador') return res.status(403).json({ msg: 'Acceso no autorizado' });

    const { conductorNombre, conductorApellido, correo, password, phone } = req.body


    if (!conductorNombre || !conductorApellido || !correo || !password || !phone) return res.status(400).json({ msg: "Debes llenar los campos nombre, apellido, correo electrónico y contraseña", });


    const verificarcorreoBDDChofer = await Chofer.findOne({ correo });

    if (verificarcorreoBDDChofer) return res.status(400).json({ msg: "Lo sentimos, el correo electrónico ya se encuentra registrado del chofer", });

    const nuevoChofer = new Chofer(req.body)

    nuevoChofer.password = await nuevoChofer.encrypPassword(password);

    const token = nuevoChofer.crearToken();

    await sendMailToUserChofer(correo, token);

    await nuevoChofer.save();

    res.status(200).json({ msg: "REvisa tu correo electronico para confirmar tu cuenta chofer" });
};

 */


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
    const existingChoferWithPlate = await Chofer.findOne({ placaVehiculo });
    if (existingChoferWithPlate) {
        return res.status(400).json({
            msg: 'La placa del vehículo ya está registrada para otro chofer',
        });
    }

    const verificarcorreoBDDChofer = await Chofer.findOne({ correo });

    if (verificarcorreoBDDChofer) {
        return res.status(400).json({
            msg: 'Lo sentimos, el correo electrónico ya se encuentra registrado para otro chofer',
        });
    }

    const nuevoChofer = new Chofer(req.body);

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




export {
    registro,
    confirmcorreo,
    login,
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
};
