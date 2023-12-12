import { Schema, model } from "mongoose";

const rutaHorarioSchema = new Schema(
    {
        ruta: {
            nombre: {
                type: String,
                required: true,
            },
            ciudad1: {
                type: String,
                required: true,
            },
            ciudad2: {
                type: String,
                required: true,
            }
        },
        horario: {
            horario1: {
                type: String,
                required: true,
            },
            horario2: {
                type: String,
                required: true,
            },
            horario3: {
                type: String,
                required: true,
            },
        },
    },
    {
        timestamps: true,
    }
);

export default model("RutayHorario", rutaHorarioSchema)