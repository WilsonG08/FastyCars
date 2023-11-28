import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const conductorSchema = new Schema(
    {
        conductorNombre: {
            type: String,
            required: true,
            trim: true,
        },
        conductorApellido: {
            type: String,
            required: true,
            trim: true,
        },
        cedula: {
            type: Number,
            required: true,
            trim: true,
            unique: true,
        },
        correo: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        marcaVehiculo: {
            type: String,
            required: true,
            trim: true,
        },
        modeloVehiculo: {
            type: String,
            required: true,
            trim: true,
        },
        anioVehiculo: {
            type: Number,
            required: true,
        },
        colorVehiculo: {
            type: String,
            required: true,
            trim: true,
        },
        numeroAsientos: {
            type: Number,
            required: true,
        },
        placaVehiculo: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        token: {
            type: String,
            default: false,
        },
        confirmcorreo: {
            type: Boolean,
            default: false,
        },
        administrador: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Administrador",
        },
        rol: {
            type: String,
            default: "Conductor",
        },
    },
    {
        timestamps: true,
    }
);

// Metodo para cifrar el password del chofer
conductorSchema.methods.encrypPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    const passwordEncryp = await bcrypt.hash(password, salt);
    return passwordEncryp;
};

// Metodo para verrificar si el password ingresado es el mismo dela BDD
conductorSchema.methods.matchPassword = async function (password) {
    const response = await bcrypt.compare(password, this.password);
    return response;
};

// Metodo para crear un token

/* conductorSchema.methods.crearToken = function(){
    const tokenGenerado = this.token = Math.random().toString(36).slice(2);
    return tokenGenerado
} */

conductorSchema.methods.crearToken = function () {
    const tokenGenerado = Math.random().toString(36).slice(2);
    this.token = tokenGenerado; // Almacena el token en el campo 'token' del modelo
    return tokenGenerado;
};

export default model("Conductor", conductorSchema);
