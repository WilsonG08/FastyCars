import twilio from 'twilio';

// Importa dotenv para cargar variables de entorno
import dotenv from 'dotenv';
dotenv.config();

// Usa directamente process.env para obtener las variables
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Función para iniciar la verificación de un número de teléfono
const startVerification = async (req, res) => {
    try {
        const { phonenumber, channel } = req.query;

        const verification = await client.verify.v2.services(process.env.TWILIO_SERVICE_ID) // Utiliza process.env para el serviceID
            .verifications
            .create({
                to: `+${phonenumber}`,
                channel,
            });

        res.status(200).send(verification);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

// Función para verificar un código de verificación
const verifyCode = async (req, res) => {
    try {
        const { phonenumber, code } = req.query;

        const verificationCheck = await client.verify.v2.services(process.env.TWILIO_SERVICE_ID) // Utiliza process.env para el serviceID
            .verificationChecks
            .create({
                to: `+${phonenumber}`,
                code,
            });

        res.status(200).send(verificationCheck);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

export { startVerification, verifyCode };
