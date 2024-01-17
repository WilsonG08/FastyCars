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
                trim: true,
            },
            apellido: {
                type: String,
                required: true,
                trim: true,
            },
            phone: {
                type: String,
                required: true,
                trim: true,
            },
        },
        destinatario: {
            nombre: {
                type: String,
                required: true,
                trim: true,
            },
            apellido: {
                type: String,
                required: true,
                trim: true,
            },
            phone: {
                type: String,
                required: true,
                trim: true,
            },
        },
        ciudadRemitente: {
            ciudad: {
                type: String,
                required: true,
                trim: true,
            },
            latitud:{
                type: String,
                required: true,
                trim: true,
            },
            longitud: {
                type: String,
                required: true,
                trim: true,
            },
            referencia: {
                type: String,
                required: false,
                trim: true,
            },
            direccion: {
                type: String,
                required: true,
                trim: true,
            },
        },
        ciudadDestinatario: {
            ciudad: {
                type: String,
                required: true,
                trim: true,
            },
            latitud:{
                type: String,
                required: true,
                trim: true,
            },
            longitud: {
                type: String,
                required: true,
                trim: true,
            },
            referencia: {
                type: String,
                required: false,
                trim: true,
            },
            direccion: {
                type: String,
                required: true,
                trim: true,
            },
        }, numPaquetes: {
            type: Number,
            required: true,
            trim: true,
        },
        turno: {
            horario: {
                type: String,
                required: true,
                trim: true,
            },
            fecha: {
                type: String,
                required: true,
                trim: true,
            },
        },
        precio:{
            type: String,
            required: false,
            trim: true,
        },
        distancia:{
            type: Number,
            required: false,
            trim: true,
        },
        estadoPaquete: {
            type: String,
            enum: ['Pendiente', 'Aprobado', 'En tránsito', 'Completado'],
            required: true,
        },
    }
);

export default model("Encomienda", registerEncomienda);