import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import registrationRouter from './routers/registration.js';

const app = express();
dotenv.config();

// Configuraciones
app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
    res.send("Server on");
});

// Usar el router de registro
app.use('/api', registrationRouter);

// Resto de tus rutas

app.listen(app.get('port'), () => {
    console.log(`Server corre en ${app.get('port')}`);
});


export default app;