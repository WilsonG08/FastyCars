import { Schema, model } from "mongoose";

const rutaSchema = new Schema(
    {
        origen: {
            type: String,
            required: true,
        },
        destino: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default model("Ruta", rutaSchema);
