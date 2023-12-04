import mongoose, { Schema, model } from "mongoose";

const reservaSchema = new Schema(
    {
        cliente: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pasajero",
            required: true,
        },
        ruta: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ruta",
            required: true,
        },
        horario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Horario",
            required: true,
        },
        numeroBoletos: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default model("ReservaBoleto", reservaSchema);
