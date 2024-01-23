import { check, validationResult } from "express-validator";
import Conductor from "../models/conductorDB.js";
import BoletoPrivado from '../models/viajePrivadoDB.js';
import Encomienda from '../models/encomiendaDb.js';
import Boleto from '../models/reservaDB.js'


const validacionRegistroAdmin = [
    check('adminNombre', 'El campo "adminNombre" es obligatorio')
        .exists()
        .notEmpty()
        .isLength({ min: 5, max: 20 })
        .withMessage('El campo "adminNombre" debe tener entre 5 y 20 caracteres')
        .isAlpha('es-ES', { ignore: 'áéíóúÁÉÍÓÚñÑ' })
        .withMessage('El campo "adminNombre" debe contener solo letras')
        .trim(),

    check('adminApellido', 'El campo "adminApellido" es obligatorio')
        .exists()
        .notEmpty()
        .isLength({ min: 5, max: 20 })
        .withMessage('El campo "adminApellido" debe tener entre 5 y 20 caracteres')
        .isAlpha('es-ES', { ignore: 'áéíóúÁÉÍÓÚñÑ' })
        .withMessage('El campo "adminApellido" debe contener solo letras')
        .trim(),

    check('correo', 'El campo "correo" es obligatorio')
        .exists()
        .notEmpty()
        .isEmail()
        .withMessage('El campo "correo" debe ser un correo electrónico válido')
        .trim(),

    check('password', 'El campo "password" es obligatorio')
        .exists()
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage('El campo "password" debe tener al menos 8 caracteres')
        .trim(),

    check('phone', 'El campo "phone" es obligatorio')
        .exists()
        .notEmpty()
        .isInt({ min: 0 })
        .withMessage('El campo "phone" debe ser un número entero positivo')
        .isLength({ max: 10 })
        .withMessage('El campo "phone" no debe tener más de 10 dígitos')
        .trim(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        } else {
            return res.status(400).send({ errors: errors.array() });
        }
    }
];



const validacionActualizarPerfil = [
    check('adminNombre', 'El campo "adminNombre" es obligatorio')
        .exists()
        .notEmpty()
        .isLength({ min: 5, max: 20 })
        .withMessage('El campo "adminNombre" debe tener entre 5 y 20 caracteres')
        .isAlpha('es-ES', { ignore: 'áéíóúÁÉÍÓÚñÑ' })
        .withMessage('El campo "adminNombre" debe contener solo letras')
        .trim(),

    check('adminApellido', 'El campo "adminApellido" es obligatorio')
        .exists()
        .notEmpty()
        .isLength({ min: 5, max: 20 })
        .withMessage('El campo "adminApellido" debe tener entre 5 y 20 caracteres')
        .isAlpha('es-ES', { ignore: 'áéíóúÁÉÍÓÚñÑ' })
        .withMessage('El campo "adminApellido" debe contener solo letras')
        .trim(),

    check('phone', 'El campo "phone" es obligatorio')
        .exists()
        .notEmpty()
        .isInt({ min: 0 })
        .withMessage('El campo "phone" debe ser un número entero positivo')
        .isLength({ max: 10 })
        .withMessage('El campo "phone" no debe tener más de 10 dígitos')
        .trim(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        } else {
            return res.status(400).send({ errors: errors.array() });
        }
    }
];


const validaUpdateConAdmin = [
    check("conductorAsignado")
        .exists()
        .withMessage('El campo "conductorAsignado" es obligatorio')
        .isMongoId()
        .withMessage('El ID del conductor no es válido')
        .customSanitizer(value => value?.trim()),

    check("estadoPax")
        .exists()
        .withMessage('El campo "estadoPax" es obligatorio')
        .equals('Aprobado')
        .withMessage('Solo se puede cambiar el estado a Aprobado'),


    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        } else {
            return res.status(400).send({ errors: errors.array() });
        }
    }
]



const validaUpdateBoletoP = [
    check("conductorAsignado")
        .exists()
        .withMessage('El campo "conductorAsignado" es obligatorio')
        .isMongoId()
        .withMessage('El ID del conductor no es válido')
        .custom(async (value, { req }) => {
            const conductor = await Conductor.findById(value);
            if (!conductor) {
                throw new Error('No se encontró el conductor con el ID proporcionado');
            }
            return true;
        }),

    check("estadoPax")
        .exists()
        .withMessage('El campo "estadoPax" es obligatorio')
        .equals('Aprobado')
        .withMessage('Solo se puede cambiar el estado a Aprobado'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        } else {
            return res.status(400).send({ errors: errors.array() });
        }
    }
]


const validaAsignarPrivado = [
    check("idBoleto")
        .exists()
        .withMessage('El campo "idBoleto" es obligatorio')
        .isMongoId()
        .withMessage('El ID del boleto no es válido')
        .custom(async (value, { req }) => {
            const boleto = await BoletoPrivado.findById(value);
            if (!boleto) {
                throw new Error('No se encontró el boleto con el ID proporcionado');
            }
            return true;
        }),

    check("idConductor")
        .exists()
        .withMessage('El campo "idConductor" es obligatorio')
        .isMongoId()
        .withMessage('El ID del conductor no es válido')
        .custom(async (value, { req }) => {
            const conductor = await Conductor.findById(value);
            if (!conductor) {
                throw new Error('No se encontró el conductor con el ID proporcionado');
            }
            return true;
        }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        } else {
            return res.status(400).send({ errors: errors.array() });
        }
    }
]



const validaUPdateEncomienda = [
    check("conductorAsignado")
        .exists()
        .withMessage('El campo "conductorAsignado" es obligatorio')
        .isMongoId()
        .withMessage('El ID del condcutor no es válido')
        .custom(async (value, { req }) => {
            const conductor = await Conductor.findById(value);
            if (!conductor) {
                throw new Error('No se encontró el conductor con el ID proporcionado');
            }
            return true;
        }),

    check("estadoPaquete")
        .exists()
        .withMessage('El campo "estadoPaquete" es obligatorio')
        .equals('Aprobado')
        .withMessage('Solo se puede cambiar el estado a Aprobado'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        } else {
            return res.status(400).send({ errors: errors.array() });
        }
    }
]

const validaAsignarEncomienda = [
    check("idEncomienda")
        .exists()
        .withMessage('El campo "idEncomienda" es obligatorio')
        .isMongoId()
        .withMessage('El ID de la idEncomienda no es válido')
        .custom(async (value, { req }) => {
            const encomienda = await Encomienda.findById(value);
            if (!encomienda) {
                throw new Error('No se encontró la encomienda con el ID proporcionado');
            }
            return true;
        }),

    check("idConductor")
        .exists()
        .withMessage('El campo "idConductor" es obligatorio')
        .isMongoId()
        .withMessage('El ID del conductor no es válido')
        .custom(async (value, { req }) => {
            const conductor = await Conductor.findById(value);
            if (!conductor) {
                throw new Error('No se encontró el conductor con el ID proporcionado');
            }
            return true;
        }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        } else {
            return res.status(400).send({ errors: errors.array() });
        }
    }
]


const validaAsignarConductorVC = [
    check("idBoleto")
        .exists()
        .withMessage('El campo "idBoleto" es obligatorio')
        .isMongoId()
        .withMessage('El ID del boleto no es válido')
        .custom(async (value, { req }) => {
            const boleto = await Boleto.findById(value);
            if (!boleto) {
                throw new Error('No se encontró el boleto con el ID proporcionado');
            }
            return true;
        }),

    check("idConductor")
        .exists()
        .withMessage('El campo "idConductor" es obligatorio')
        .isMongoId()
        .withMessage('El ID del conductor no es válido')
        .custom(async (value, { req }) => {
            const conductor = await Conductor.findById(value);
            if (!conductor) {
                throw new Error('No se encontró el conductor con el ID proporcionado');
            }
            return true;
        }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        } else {
            return res.status(400).send({ errors: errors.array() });
        }
    }
]

export {
    validacionRegistroAdmin,
    validacionActualizarPerfil,
    validaUpdateConAdmin,
    validaUpdateBoletoP,
    validaAsignarPrivado,
    validaUPdateEncomienda,
    validaAsignarEncomienda,
    validaAsignarConductorVC
}