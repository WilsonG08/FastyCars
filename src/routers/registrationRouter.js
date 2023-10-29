import express from 'express';
import { verify } from '../controllers/authenticationController.js'; // Importa la función de verificación desde el controlador

const router = express.Router();

// Ruta para verificar el código
router.get('/verify', verify);

export default router;
