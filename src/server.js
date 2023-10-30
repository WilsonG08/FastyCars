import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import routerPasajeros from './routers/pasajero_routes.js'
import routerChofer from './routers/chofer_router.js'

// Inicializaciones
const app = express();
dotenv.config();

// Configuraciones
app.set('port', process.env.PORT || 3000);
app.use(cors());


// Middlewares
app.use(express.json());


// Variables globales


// Rutas
app.use('/api', routerChofer);
app.use('/api', routerPasajeros);

// Manejo de una ruta no encontrda
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"))


export default app;