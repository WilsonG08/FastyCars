import express from 'express';
import { registerPasajero } from '../controllers/registerController.js';

const registrationRouter = express.Router();

// Definir la ruta de registro (por ejemplo, '/register')
registrationRouter.post('/register', registerPasajero);

export default registrationRouter;
