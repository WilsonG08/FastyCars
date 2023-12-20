import { Schema, model } from "mongoose";

const boletoSchema = new Schema(
    {
        clienteId: {
            type: Schema.Types.ObjectId,
            ref: 'Pasajero',
            required: true,
        },
        conductorAsignado: {
            type: Schema.Types.ObjectId,
            ref: 'Conductor',
            default: null,
        },
        user: {
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
        ciudadSalida: {
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
        ciudadLlegada: {
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
        estadoPax: {
            type: String,
            enum: ['Pendiente', 'En tránsito', 'Completado'],
            required: true,
        },
        
    },
    {
        timestamps: true,
    }
);

export default model("Boleto", boletoSchema);
