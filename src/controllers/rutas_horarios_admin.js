import Horario from '../models/horarioDb.js';
import Ruta from '../models/rutaDB.js';

const registrarRuta = async (req, res) => {
    
    const { origen, destino } = req.body

    if( !origen || !destino) return res.status(400).json({msg: "Lo sentimos, debes llenar todos los campos"})

    const nuevaRuta = new Ruta(req.body);

    try {
        await nuevaRuta.save();
        res.status(200).json({
            msg: "Ruta registrada con exito"
        });
    } catch (error) {
        res.status(500).json({msg: "Hubo un error al registrar la ruta", error});
    }
};


const registrarHorario = async (req, res) => {
    
    const { nombreTurno, horaTurno } = req.body

    if( !nombreTurno || !horaTurno) return res.status(400).json({msg: "Lo sentimos, debes llenar todos los campos"})

    const nuevoHorario = new Horario(req.body);

    try {
        await nuevoHorario.save();
        res.status(200).json({
            msg: "Horario registrada con exito"
        });
    } catch (error) {
        res.status(500).json({msg: "Hubo un error al registrar el horario", error});
    }
};



export {
    registrarRuta,
    registrarHorario
};
