import { Schema, model } from "mongoose";

const boletoSchema = new Schema(
    {
        tipoBoleto:{
            type: String,
            default: 'Compartido'
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
        user: {
            nombre: {
                type: String,
                required: true,
                trim: true
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
        ciudadSalida: {
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
        ciudadLlegada: {
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
        numPax: {
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
            required: true,
        },
        distancia:{
            type: Number,
            required: false,
        },
        estadoPax: {
            type: String,
            enum: ['Pendiente', 'Aprobado', 'En tránsito', 'Completado'],
            required: true,
        },
        
    },
    {
        timestamps: true,
    }
);

export default model("Boleto", boletoSchema);
