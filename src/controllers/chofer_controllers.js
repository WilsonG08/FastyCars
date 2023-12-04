import Chofer from '../models/conductorDB.js'
import mongoose from 'mongoose';
import generarJWT from "../helpers/crearJWT.js";

const listarchoferes = async(req, res) =>{
    const chofer = await Chofer.find({estado:true}).where('Chofer').equals(req.choferBDD).select("-createdAt  -updateAt").populate('Chofer', '_id name lastName')
    
    res.status(200).json(chofer)
}

const detalleChofer =  async( req, res ) =>{
    const { id } = req.params

    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg: `Lo sentimos, no existe el chofer ${id}`});

    const chofer = await Chofer.findById(id).select("-createdAt -updatedAt -__v").populate('administrdor','_id name lastName')
    
    res.status(200).json(chofer)
}


const actualizarChofer = async (req, res) => {
    const { id } = req.params

    if( Object.values(req.body).includes("")) return res.status(400).json({msg: "Lo sentimos, debes llenar todos los campos"})

    if( !mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({msg:`Lo sentimos, no existe el Chofer ${id}`})

    await Chofer.findByIdAndUpdate(req.params.id,req.body)

    res.status(200).json({msg: "Actualizacion exitosa del chofer"})
}


const confirmEmail = async (req,res) => {
    if( !(req.params.token) ) return res.status(400).json({msg: "Lo sentimos, no se puede validar la cuenta"})

    const choferBDD = await Chofer.findOne({token:req.params.token})

    if( !choferBDD?.token ) return res.status(404).json({msg: "La cuenta ya ha sido confirmada CHOFER"})

    choferBDD.token = null

    choferBDD.confirmEmail = true

    await choferBDD.save()

    res.status(200).json({msg: "Token cofirmado, ya puedes iniciar sesion querido CHOFER"})
}

// esta funcion no tiene que ir 
const eliminarChofer = async(req, res) => {
    const { id } = req.params

    if( Object.values(req.body).includes("")) return res.status(400).json({msg: "Lo sentimos, debes llenar todos los campos"})

    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg: `Lo sentimos, no existe el Chofer ${id}`})

    // duda, no va esta linea
    const { salida } = req.body

    await Chofer.findByIdAndUpdate(req.params.id,{salida: Date.parse(salida),estado:false})

    res.status(200).json({msg: "Fecha de salida"})
}

export {
    listarchoferes,
    detalleChofer,
    actualizarChofer,
    eliminarChofer,
    confirmEmail
}

