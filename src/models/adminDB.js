// Esta carpeta contiene los modelos de la aplicación. Los modelos representan los datos de la aplicación.

import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new Schema({
    name:{
        type: String, 
        require: true,
        trim: true
    },
    lastName:{
        type: String, 
        require: true,
        trim: true
    },
    email:{
        type: String, 
        require: true,
        trim: true
    },
    password:{
        type: String, 
        require: true,
        trim: true
    },
    phone:{
        type: String, 
        //require: true,
        trim: true
    },
    confirmPhone:{
        type: Boolean, 
        default: false
    },
    token:{
        type: String,
        default: null
    }

},{
    timestamps: true
})

// Metodo para cifrar el password del veterinario
adminSchema.methods.encrypPassword = async function ( password ){
    const salt = await bcrypt.genSalt(10)
    const passwordEncryp = await bcrypt.hash(password, salt)
    return passwordEncryp
}

// Metodo para verificar si el password ingresado es el mismo de la BDD
adminSchema.methods.matchPassword =  async function( password ) {
    const response = await bcrypt.compare(  password, this.password )
    return response
}

// Metodo para crear un token
adminSchema.methods.crearToken = function(){
    const tokenGenerado = this.token = Math.random().toString(36).slice(2)
    return tokenGenerado
}

export default model('Administrador', adminSchema);
