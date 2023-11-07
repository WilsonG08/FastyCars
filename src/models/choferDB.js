import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcryptjs"

const choferSchema = new Schema({
    choferName:{
        type: String, 
        required: true,
        trim: true
    },
    choferLastName:{
        type: String, 
        required: true,
        trim: true
    },
    email:{
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
        type: String, 
        required: true,
        trim: true
    },
    token:{
        type: String,
        default: false
    },
    confirmEmail:{
        type: Boolean,
        default: false
    },
    administrador:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Administrador'
    },
    rol:{
        type: String,
        default: "chofer"
    }
},{
    timestamps: true
})

// Metodo para cifrar el password del chofer
choferSchema.methods.encrypPassword = async function(password){
    const salt = await bcrypt.genSalt(10)
    const passwordEncryp = await bcrypt.hash(password, salt)
    return passwordEncryp
}

// Metodo para verrificar si el password ingresado es el mismo dela BDD
choferSchema.methods.matchPassword = async function(password){
    const response =  await bcrypt.compare(password, this.password)
    return response
}

// Metodo para crear un token

choferSchema.methods.crearToken = function(){
    const tokenGenerado = this.token = Math.random().toString(36).slice(2);
    return tokenGenerado
}

export default model('Chofer', choferSchema)