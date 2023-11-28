import nodemailer from "nodemailer"
import dotenv from 'dotenv'
dotenv.config()

// Creación del transporter
const transport = nodemailer.createTransport({
    host: process.env.HOST_GMAIL,
    port: process.env.PORT_GMAIL,
    auth: {
        user: process.env.USER_GMAIL,
        pass: process.env.PASS_GMAIL
    }
})

// send mail with defined transport object
const sendMailToUser = async(userMail,token)=>{
    let info = await transport.sendMail({
    from: 'admin@vet.com',
    to: userMail,
    subject: "Confirma la autenticidad de tu dirección de correo electrónico.",
    html: `
    <h1>Sistema de gestión (FAST-CAR 🏁 🚗🚘)</h1>
    <hr>
    <a href=${process.env.URL_BACKEND}confirmar/${token}>Clic para confirmar tu cuenta</a>
    <hr>
    <footer>Fast-Car te da la Bienvenida!</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}

const sendMailToUserChofer = async(userMail,token)=>{
    let info = await transport.sendMail({
    from: 'admin@vet.com',
    to: userMail,
    subject: "Confirma la autenticidad de tu dirección de correo electrónico.",
    html: `
    <h1>Sistema de gestión - CHOFER (FAST-CAR 🏁 🚗🚘)</h1>
    <hr>
    <a href=${process.env.URL_BACKEND}chofer/confirmar/${token}>Clic para confirmar tu cuenta</a>
    <hr>
    <footer>Fast-Car te da la Bienvenida!</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}

// para el administrador
const sendMailToUserAdmin = async(userMail,token)=>{
    let info = await transport.sendMail({
    from: 'admin@vet.com',
    to: userMail,
    subject: "Confirma la autenticidad de tu dirección de correo electrónico.",
    html: `
    <h1>Sistema de gestión - ADMINNISTRADOR  (FAST-CAR 🏁 🚗🚘)</h1>
    <hr>
    <a href=${process.env.URL_BACKEND}admin/confirmar/${token}>Clic para confirmar tu cuenta</a>
    <hr>
    <footer>Fast-Car te da la Bienvenida!</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}


// send mail with defined transport object
const sendMailToRecoveryPassword = async(userMail,token)=>{
    let info = await transport.sendMail({
    from: 'admin@vet.com',
    to: userMail,
    subject: "Correo para reestablecer tu contraseña",
    html: `
    <h1>Sistema de gestión PASAJERO - RECUPERAR (FAST-CAR 🏁 🚗🚘)</h1>
    <hr>
    <a href=${process.env.URL_BACKEND}recuperar-password/${token}>Clic para reestablecer tu contraseña</a>
    <hr>
    <footer>Fast-Car te da la Bienvenida!</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}



const sendMailToRecoveryPasswordAdmin = async(userMail,token)=>{
    let info = await transport.sendMail({
    from: 'admin@vet.com',
    to: userMail,
    subject: "Correo para reestablecer tu contraseña",
    html: `
    <h1>Sistema de gestión - ADMINNISTRADOR (FAST-CAR 🏁 🚗🚘)</h1>
    <hr>
    <a href=${process.env.URL_BACKEND}admin/recuperar-password/${token}>Clic para reestablecer tu contraseña</a>
    <hr>
    <footer>Fast-Car te da la Bienvenida!</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}


export {
    sendMailToUser,
    sendMailToUserAdmin,
    sendMailToUserChofer,
    sendMailToRecoveryPassword,
    sendMailToRecoveryPasswordAdmin
}