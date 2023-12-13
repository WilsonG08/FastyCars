import { Schema, model } from "mongoose";

const boletoSchema = new Schema(
    {
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
                required: true,
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
                required: true,
            },
            direccion: {
                type: String,
                required: true,
            },
        },
        numPax: {
            type: String,
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
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default model("Boleto", boletoSchema);
