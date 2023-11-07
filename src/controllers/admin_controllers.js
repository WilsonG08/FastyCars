import Administrador from "../models/adminDB.js";
import Chofer from "../models/choferDB.js";
import generarJWT from "../helpers/crearJWT.js";
import mongoose from "mongoose";
import {
    sendMailToRecoveryPassword,
    sendMailToUserAdmin,
    sendMailToUserChofer,
} from "../config/nodemailer.js";

const registro = async (req, res) => {
    const { adminName, adminLastName, email, password, phone } = req.body

    if (!adminName || !adminLastName || !email || !password || !phone) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });

    const verificarEmailBDD = await Administrador.findOne({ email });

    if (verificarEmailBDD) return res.status(400).json({ msg: "Lo sentimos, el email ya se encuentra registrado" });

    const nuevoAdmin = new Administrador(req.body);

    nuevoAdmin.password = await nuevoAdmin.encrypPassword(password);

    const token = nuevoAdmin.crearToken();

    await sendMailToUserAdmin(email, token);

    await nuevoAdmin.save();

    res.status(200).json({
        msg: "Revisa tu correo electronico para confirmar tu cuenta ADMIN",
    });
};

const confirmEmail = async (req, res) => {
    if (!req.params.token) return res.status(400).json({ msg: "Lo sentimos, no se puede validar la cuenta" });

    const administradorBDD = await Administrador.findOne({token: req.params.token});

    if (!administradorBDD?.token)return res.status(404).json({ msg: "La cuenta ya ha sido confirmada ADMIN" });

    administradorBDD.token = null;

    administradorBDD.confirmEmail = true;

    await administradorBDD.save();

    res.status(200).json({
        msg: "Token de administrador confirmado, ya puedes iniciar sesión",
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" });

    const administradorBDD = await Administrador.findOne({ email }).select("-status -__v -token -updatedAt -createdAt");

    if (administradorBDD?.confirmEmail == false) return res.status(403).json({ msg: "Lo sentimos, debs de verificar su cuenta" });

    if (!administradorBDD) return res.status(404).json({msg: "Lo sentimo, el administrador no se encuentra resgistrado"});

    const verificarPassword = await administradorBDD.matchPassword(password);

    if (!verificarPassword) return res.status(404).json({ msg: "Lo sentimos, el password no es el correcto" });

    // Asignacion del ROL
    const token = generarJWT(administradorBDD._id, "administrador");

    const { adminName, adminLastName, phone, _id } = administradorBDD;

    res.status(200).json({
        token,
        adminName,
        adminLastName,
        phone,
        _id,
        email: administradorBDD.email,
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

const listarChoferes = (req, res) => {
    res.status(200).json({ res: "Lista de choferes registrados" });
};

const listarpasajeros = (req, res) => {
    res.status(200).json({ res: "Lista de pasajeros registrados" });
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
    const { id } = req.params

    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});

    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})

    const administradorBDD = await Administrador.findById(id)

    if(!administradorBDD) return res.status(404).json({msg: `Lo sentimos, no existe el administrador ${id}`})

    if(administradorBDD.email != req.body.email)
    {
        const administradorBDDMail = await Administrador.findOne({email:req.body.email})
        
        if(administradorBDDMail)
        {
            return res.status(404).json({msg: `Lo sentimos, ya se encuentra registrado`})
        }
    }

    administradorBDD.adminName = req.body.adminName || administradorBDD?.adminName
    administradorBDD.adminLastName = req.body.adminLastName || administradorBDD?.adminLastName
    administradorBDD.email = req.body.email || administradorBDD?.email
    administradorBDD.phone = req.body.phone || administradorBDD?.phone

    await administradorBDD.save()

    res.status(200).json({msg: "Perfil actualizado correctamente"})
};


const actualizarPassword = async (req,res) =>{
    const administradorBDD = await Administrador.findById(req.administradorBDD._id)

    if(!administradorBDD) return res.status(404).json({msg: `Lo sentimos, no existe el administrador ${id}`})

    const verificarPassword = await administradorBDD.matchPassword(req.body.passwordactual)

    if(!verificarPassword) return res.status(404).json({msg: "Lo sentimos, el password actual no es el correcto"})
    
    administradorBDD.password = await administradorBDD.encrypPassword(req.body.passwordnuevo)

    await administradorBDD.save()

    res.status(200).json({msg: "Password actualizado correctamente!"})
}


const recuperarPassword = async(re, res) => {
    const { email } = req.body

    if( Object.values(req.body).includes("")) return res.status(404).json({msg: "Lo sentimos, debes llenar todos los campos"})

    const administradorBDD = await Administrador.findOne({email})

    if(!administradorBDD) return res.status(404).json({msg: "Lo sentimos, el usuario no se encuentra registrado"})

    const token = administradorBDD.crearToken()

    administradorBDD.token = token

    await sendMailToRecoveryPassword(email, token)

    await administradorBDD.save()

    res.status(200).json({msg: "Revisa tu correo electronico para reestablecer tu cuenta"})
}

const comprobarTokenPassword = async (req, res) => {
    if(!(res.params.token)) return res.status(404).json({msg: "Lo sentimos, no se puede validar la cuenta"})

    const administradorBDD = await Administrador.findOne({token:req.params.token})

    if(administradorBDD?.token !== req.params.token) return res.status(404).json({msg: "Lo sentimos, no se puede validar la cuenta"})

    await administradorBDD.save()

    res.status(200).json({msg: "Token confirmado, ya puedes crear tu nuevo password"})
}


const nuevoPassword = async (req, res) => {
    const { password, confirmpassword } = req.body
    
    if(Object.values(req.body).includes("")) return res.status(404).json({msg: "Lo sentimos, debes llenar todos los campos"})

    if( password != confirmpassword) return res.status(404).json({msg: "Lo sentimos, los passwords no coinciden!"})

    const administradorBDD = await Administrador.findOne({token:req.params.token})

    if( administradorBDD?.token !== req.params.token ) return res.status(404).json({msg: "LO sentimos, no se puede validar la cuenta"})

    administradorBDD.token = null

    administradorBDD.password = await administradorBDD.encrypPassword(password)

    await administradorBDD.save()

    res.status(200).json({msg: "Felicidades, ya puedes iniciar sesion con tu nuevo password"})
}


const registrarChofer = async (req, res) => {

    // Verifica si el usuario autenticado es un administrador
    if (req.rol !== 'administrador') return res.status(403).json({ msg: 'Acceso no autorizado' });
    
    const { choferName, choferLastName, email, password, phone } = req.body

    
    if (!choferName || !choferLastName || !email || !password || !phone) return res.status(400).json({msg: "Debes llenar los campos nombre, apellido, correo electrónico y contraseña",});
    

    const verificarEmailBDDChofer = await Chofer.findOne({ email });

    if (verificarEmailBDDChofer) return res.status(400).json({msg: "Lo sentimos, el correo electrónico ya se encuentra registrado del chofer",});

    const nuevoChofer = new Chofer(req.body)

    nuevoChofer.password = await nuevoChofer.encrypPassword(password);

    const token = nuevoChofer.crearToken();

    await sendMailToUserChofer(email, token);

    await nuevoChofer.save();

    res.status(200).json({msg: "REvisa tu correo electronico para confirmar tu cuenta chofer"});
};



export {
    registro,
    confirmEmail,
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
