// Esta carpeta contiene los enrutadores de la aplicación. Los enrutadores se utilizan para mapear las URL a los controladores.

import { Router } from 'express';
const router =  Router();


router.post('/registro', (req, res) => res.send("Registro del pasajero"));

router.post('/login', (req, res) => res.send("Login del pasajero"));

router.get('/confirmar/:token', (req, res)=> res.send("Confirmar TOKEN"))

router.get('/pasajero', (req, res)=> res.send("Confirmar TOKEN"))


