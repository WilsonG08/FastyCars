import { Schema, model } from "mongoose";

const servicioSchema = new Schema(
    {
        nombreServicio: {
            type: String,
            unique: true,
            required: true,
        },
        detalleServicio:{
            type: String,
            unique: true,
            required: true,
        },
        valorEstimado:{
            type: Number,
            unique: true,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);


export default model("Servicio", servicioSchema);
