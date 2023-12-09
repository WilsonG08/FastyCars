import { Schema, model } from "mongoose";

const horarioSchema = new Schema(
    {
        nombreTurno: {
            type: String,
            required: true,
        },
        horaTurno: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);


export default model("Horario", horarioSchema);