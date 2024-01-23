import { check, validationResult } from 'express-validator';

const validaActualizarChofer = [
    check("conductorNombre", 'El campo "conductorNombre" es obligatorio')
        .exists()
        .notEmpty()
        .isLength({ min: 5, max: 20 })
        .withMessage('El campo "conductorNombre" debe tener entre 5 y 20 caracteres')
        .isAlpha('es-ES', { ignore: 'áéíóúÁÉÍÓÚñÑ' })
        .withMessage('El campo "conductorNombre" debe contener solo letras')
        .trim(),

    check("conductorApellido", 'El campo "conductorApellido" es obligatorio')
        .exists()
        .notEmpty()
        .isLength({ min: 4, max: 20 })
        .withMessage('El campo "conductorApellido" debe tener entre 4 y 20 caracteres')
        .isAlpha('es-ES', { ignore: 'áéíóúÁÉÍÓÚñÑ' })
        .withMessage('El campo "conductorApellido" debe contener solo letras')
        .trim(),

    check("phone", 'El campo "phone" es obligatorio')
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
]




const validaActualizarEstadoCompartido = [
    check("idBoleto", 'El campo "idBoleto" es obligatorio')
        .exists()
        .notEmpty()
        .isMongoId()
        .withMessage('El ID del boleto no es válido')
        .trim(),

    check("idConductor", 'El campo "idConductor" es obligatorio')
        .exists()
        .notEmpty()
        .isMongoId()
        .withMessage('El ID del conductor no es válido')
        .trim(),

    check("nuevoEstado", 'El campo "nuevoEstado" es obligatorio')
        .exists()
        .notEmpty()
        .isIn(['En tránsito', 'Completado'])
        .withMessage('El estado debe ser "En tránsito" o "Completado"')
        .trim(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        } else {
            return res.status(400).send({ errors: errors.array() });
        }
    }
]





const validaActualizarEstadoPrivado = [
    check("idBoleto", 'El campo "idBoleto" es obligatorio')
        .exists()
        .notEmpty()
        .isMongoId()
        .withMessage('El ID del boleto no es válido')
        .trim(),

    check("idConductor", 'El campo "idConductor" es obligatorio')
        .exists()
        .notEmpty()
        .isMongoId()
        .withMessage('El ID del conductor no es válido')
        .trim(),

    check("nuevoEstado", 'El campo "nuevoEstado" es obligatorio')
        .exists()
        .notEmpty()
        .isIn(['En tránsito', 'Completado'])
        .withMessage('El estado debe ser "En tránsito" o "Completado"')
        .trim(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        } else {
            return res.status(400).send({ errors: errors.array() });
        }
    }
]




const validaActualizarEstadoEncomienda = [
    check("idEncomienda", 'El campo "idEncomienda" es obligatorio')
        .exists()
        .notEmpty()
        .isMongoId()
        .withMessage('El ID de la encomienda no es válido')
        .trim(),

    check("idConductor", 'El campo "idConductor" es obligatorio')
        .exists()
        .notEmpty()
        .isMongoId()
        .withMessage('El ID del conductor no es válido')
        .trim(),

    check("nuevoEstado", 'El campo "nuevoEstado" es obligatorio')
        .exists()
        .notEmpty()
        .isIn(['En tránsito', 'Completado'])
        .withMessage('El estado debe ser "En tránsito" o "Completado"')
        .trim(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        } else {
            return res.status(400).send({ errors: errors.array() });
        }
    }
]






export{
    validaActualizarChofer,
    validaActualizarEstadoCompartido,
    validaActualizarEstadoPrivado,
    validaActualizarEstadoEncomienda
}
