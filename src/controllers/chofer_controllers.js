import Chofer from '../models/choferDB.js'
import mongoose from 'mongoose';

const listarchoferes = async(req, res) =>{
    const chofer = await Chofer.find({estado:true}).where('administrador').equals(req.administradorBDD).select("-createdAt  -updateAt").populate('administrador', '_id name lastName')
    
    res.status(200).json(chofer)
}

const detalleChofer =  async( req, res ) =>{
    const { id } = req.params

    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg: `Lo sentimos, no existe el chofer ${id}`});

    const chofer = await Chofer.findById(id).select("-createdAt -updatedAt -__v").populate('administrdor','_id name lastName')
    
    res.status(200).json(chofer)
}


const registrarChofer = async( req, res ) => {
    if ( Object.values(req.body).includes("")) return res.status(400).json({msg: "Lo sentimos, debes llenar todos los campos"})

    const nuevoChofer = new Chofer(req.body)

    nuevoChofer.administrador=req.body.id

    await nuevoChofer.save()

    res.status(200).json({msg: "Registro exitoso del chofer"})
}


const actualizarChofer = async (req, res) => {
    const { id } = req.params

    if( Object.values(req.body).includes("")) return res.status(400).json({msg: "Lo sentimos, debes llenar todos los campos"})

    if( !mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({msg:`Lo sentimos, no existe el administrador ${id}`})

    await Chofer.findByIdAndUpdate(req.params.id,req.body)

    res.status(200).json({msg: "Actualizacion exitosa del chofer"})
}


// esta funcion no tiene que ir 
const eliminarChofer = async(req, res) => {
    const { id } = req.params

    if( Object.values(req.body).includes("")) return res.status(400).json({msg: "Lo sentimos, debes llenar todos los campos"})

    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg: `Lo sentimos, no existe el administrador ${id}`})

    // duda, no va esta linea
    const { salida } = req.body

    await Chofer.findByIdAndUpdate(req.params.id,{salida: Date.parse(salida),estado:false})

    res.status(200).json({msg: "Fecha de salida"})
}

export {
    listarchoferes,
    detalleChofer,
    registrarChofer,
    actualizarChofer,
    eliminarChofer
}

