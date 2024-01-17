import { Schema, model } from "mongoose";

const rutaHorarioSchema = new Schema(
    {
        ruta: {
            nombre: {
                type: String,
                required: true,
                trim: true
            },
            ciudad1: {
                type: String,
                required: true,
                trim: true
            },
            ciudad2: {
                type: String,
                required: true,
                trim: true
            }
        },
        horario: {
            horario1: {
                type: String,
                required: true,
                trim: true
            },
            horario2: {
                type: String,
                required: true,
                trim: true
            },
            horario3: {
                type: String,
                required: true,
                trim: true
            },
        },
    },
    {
        timestamps: true,
    }
);


export default model("RutayHorario", rutaHorarioSchema)