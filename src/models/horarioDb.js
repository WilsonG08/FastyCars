
import { Schema, model } from "mongoose";


const horarioSchema = new Schema(
    {
        nombreHorario: {
            type: String,
            required: true,
        },
        horaHorario: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);


export default model("Horario", horarioSchema);