import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

// Configuraciones
app.set('port', process.env.PORT || 3000);
app.use(cors());


// Middlewares
app.use(express.json());


// Variables globales


// Rutas
app.get('/', (req, res) => {
    res.send("Server on");
});

// Usar el router de registro
//app.use('/api');

// Manejo de una ruta no encontrda
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"))


export default app;