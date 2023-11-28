// Esta carpeta contiene los modelos de la aplicación. Los modelos representan los datos de la aplicación.

import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const pasajeroSchema = new Schema({
    pasajeroNombre:{
        type: String, 
        required: true,
        trim: true
    },
    pasajeroApellido:{
        type: String, 
        required: true,
        trim: true
    },
    correo:{
        type: String, 
        required: true,
        trim: true
    },
    password:{
        type: String, 
        required: true,
        trim: true
    },
    phone:{
        type: Number, 
        required: true,
        trim: true
    },
    confirmcorreo:{
        type:Boolean,
        default:false
    },
    token:{
        type: String,
        default: null
    },
    rol:{
        type: String,
        default: "Pasajero"
    }

},{
    timestamps: true
})


// Metodo para cifrar el password del veterinario
pasajeroSchema.methods.encrypPassword = async function ( password ){
    const salt = await bcrypt.genSalt(10)
    const passwordEncryp = await bcrypt.hash(password, salt)
    return passwordEncryp
}

// Metodo para verificar si el password ingresado es el mismo de la BDD
pasajeroSchema.methods.matchPassword =  async function( password ) {
    const response = await bcrypt.compare(  password, this.password )
    return response
}

// Metodo para crear un token
/* pasajeroSchema.methods.crearToken = function(){
    const tokenGenerado = this.token = Math.random().toString(36).slice(2)
    return tokenGenerado
} */


pasajeroSchema.methods.crearToken = function () {
    const tokenGenerado = Math.random().toString(36).slice(2);
    this.token = tokenGenerado; // Almacena el token en el campo 'token' del modelo
    return tokenGenerado;
};

export default model('Pasajero', pasajeroSchema);
