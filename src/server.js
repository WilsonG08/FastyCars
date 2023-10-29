import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

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
app.use('/api');

// Resto de tus rutas

app.listen(app.get('port'), () => {
    console.log(`Server corre en ${app.get('port')}`);
});


export default app;