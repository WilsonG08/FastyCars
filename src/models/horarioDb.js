
import { Schema, model } from "mongoose";


const turnoSchema = new Schema(
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


export default model("Horario", turnoSchema);