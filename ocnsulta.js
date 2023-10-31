

// consultas de las 3 primeras tablas
if(isAdminTA == true && isAdminTP == false && isAdminTP == false ){
    //aqui va la ruta de administador
}else{
    // passenger viene del squema de pasajero == 1
    // si el campo passanger existe en la tabla pasajero entra o en caso 
    // si existe entra por la ruta de pasajero y
    //  en la tabla de chofer no deberia exitir el campo passanger
    // entonces por else entra a la ruta de chofer 
    if(passenger == 1 && passenger == 0){
        // aqui va la ruta del pasajero
    }else{
        // todo lo del chofer
    }
}



// Dentro del middleware la logica seria

// 1. si en la req se guarda los datos del usuario
// 2. lo de arriba se almacena en una varible
// 3. se pregunta si el contenido

const tipoU = req.body
// aqui me trae el rol de usuario 
if (rolPermitido.includes(tipoU.isAdmin)){
    // el next 
}

// el usuario debe llegar con datos para poder hacer la verificacion
