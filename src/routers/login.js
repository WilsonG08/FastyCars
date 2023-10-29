import express from 'express';
import { login } from '../controllers/authenticationController.js'; // Importa la función de autenticación desde el controlador

const router = express.Router();

// Ruta para la autenticación (login)
router.get('/login', login);

export default router;
