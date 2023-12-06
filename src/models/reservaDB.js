import { Schema, model } from "mongoose";

const reservaBoletoSchema = new Schema({
    pasajero: {
        nombre: {
            type: String,
            required: true,
        },
        apellido: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
            required: true,
        },
    },
    desde: {
        type: String, // Puedes cambiar el tipo según tu necesidad
        required: true,
    },
    hasta: {
        type: String, // Puedes cambiar el tipo según tu necesidad
        required: true,
    },
    fecha: {
        type: Date,
        required: true,
    },
    numeroAsientos: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

export default model("ReservaBoleto", reservaBoletoSchema);
