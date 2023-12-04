import { Schema, model } from "mongoose";


const encomiendaSchema = new Schema(
    {
        nombreRemitente:{
            type: String,
            required: true,
        },
        cedula: {
            type: Number,
            required: true,
            trim: true,
            unique: true,
        },
        direccionOrigen:{
            type: String,
            required: true,
        },
        descripcionLugar:{
            type: String,
            required: true,
        },
        telefono :{
            type: String,
            required: true,
            trim: true,
        },
        nombreDestinatario:{
            type: String,
            required: true,
        },
        direccionFinal:{
            type: String,
            required: true,
        },
        puntoEntrega:{
            type: String,
            required: true,
        },
        estadoEntrega:{
            type: String,
            required: true,
            enum: ['No recogido', 'En camino', 'Entregado'],  
            default: 'No recogido',  
        },
        cliente :{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cliente",
        }
    },
    {
        timestamps: true,
    }
);

export default model("Encomienda", encomiendaSchema);