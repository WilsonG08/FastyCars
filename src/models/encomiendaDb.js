import { Schema, model } from "mongoose";

const registerEncomienda = new Schema(
    {
        tipoBoleto:{
            type: String,
            default: 'Encomienda'
        },
        conductorAsignado: {
            type: Schema.Types.ObjectId,
            ref: 'Conductor',
            default: null,
        },
        pasajeroId: {
            type: Schema.Types.ObjectId,
            ref: 'Pasajero',
            required: true,
        },
        remitente: {
            nombre: {
                type: String,
                required: true,
            },
            apellido: {
                type: String,
                required: true,
            },
            phone: {
                type: String,
                required: true,
            },
        },
        destinatario: {
            nombre: {
                type: String,
                required: true,
            },
            apellido: {
                type: String,
                required: true,
            },
            phone: {
                type: String,
                required: true,
            },
        },
        ciudadRemitente: {
            ciudad: {
                type: String,
                required: true,
            },
            latitud:{
                type: String,
                required: true,
            },
            longitud: {
                type: String,
                required: true,
            },
            referencia: {
                type: String,
                required: false,
            },
            direccion: {
                type: String,
                required: true,
            },
        },
        ciudadDestinatario: {
            ciudad: {
                type: String,
                required: true,
            },
            latitud:{
                type: String,
                required: true,
            },
            longitud: {
                type: String,
                required: true,
            },
            referencia: {
                type: String,
                required: false,
            },
            direccion: {
                type: String,
                required: true,
            },
        }, numPaquetes: {
            type: Number,
            required: true,
        },
        turno: {
            horario: {
                type: String,
                required: true,
            },
            fecha: {
                type: String,
                required: true,
            },
        },
        precio:{
            type: String,
            required: false,
        },
        estadoPaquete: {
            type: String,
            enum: ['Pendiente', 'Aprobado', 'En tránsito', 'Completado'],
            required: true,
        },
    }
);

export default model("Encomienda", registerEncomienda);