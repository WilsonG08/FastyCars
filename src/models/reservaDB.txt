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
            ruta: {
                type: Schema.Types.ObjectId,
                ref: "Ruta",
                required: true,
            },
            ciudad: {
                type: String,
                required: true,
            },
            /* direccion: {
                type: String,
                required: true,
            },
            latitud: {
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
            }, */
        },
        ciudadLlegada: {
            ruta: {
                type: Schema.Types.ObjectId,
                ref: "Ruta",
                required: true,
            },
            ciudad: {
                type: String,
                required: true,
            },
            /* direccion: {
                type: String,
                required: true,
            },
            latitud: {
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
            }, */
        },
        numPax: {
            type: String,
            required: true,
        },
        turno: {
            horario: {
                type: Schema.Types.ObjectId,
                ref: "Horario",
                required: true,
            },
            fecha: {
                type: String,
                required: true,
            },
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



