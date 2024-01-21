import { Schema, model } from "mongoose";

const servicioSchema = new Schema(
    {
        nombreServicio: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        detalleServicio:{
            type: String,
            required: true,
            trim: true,
        },
        valorEstimado:{
            type: Number,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

export default model("Servicio", servicioSchema);
