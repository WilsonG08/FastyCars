import { check, validationResult } from "express-validator";

const validacionBoleto = [
    check("user.nombre")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .customSanitizer((value) => value?.trim())
        .isLength({ min: 3, max: 20 })
        .withMessage('El campo "nombre" debe tener entre 3 y 20 caracteres')
        .isAlpha("es-ES", { ignore: "áéíóúÁÉÍÓÚñÑ" })
        .withMessage('El campo "nombre" debe contener solo letras')
        .isString()
        .withMessage("El campo debe ser una cadena de texto"),

    check("user.apellido")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .customSanitizer((value) => value?.trim())
        .isLength({ min: 3, max: 20 })
        .withMessage('El campo "apellido" debe tener entre 3 y 20 caracteres')
        .isAlpha("es-ES", { ignore: "áéíóúÁÉÍÓÚñÑ" })
        .withMessage('El campo "apellido" debe contener solo letras')
        .isString()
        .withMessage("El campo debe ser una cadena de texto"),

    check("user.phone")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .isNumeric()
        .withMessage("El campo debe ser un número")
        .isLength({ max: 10 })
        .withMessage("El número de teléfono no puede tener más de 10 dígitos"),

    check("ciudadSalida.ciudad")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .customSanitizer((value) => value?.trim())
        .isAlpha("es-ES", { ignore: "áéíóúÁÉÍÓÚñÑ" })
        .withMessage("El campo debe ser una cadena de texto con solo letras"),

    check("ciudadSalida.direccion")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío"),

    check("ciudadLlegada.ciudad")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .customSanitizer((value) => value?.trim())
        .isAlpha("es-ES", { ignore: "áéíóúÁÉÍÓÚñÑ" })
        .withMessage("El campo debe ser una cadena de texto con solo letras"),

    check("ciudadLlegada.direccion")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío"),

    check("distancia")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .isNumeric()
        .withMessage("El campo debe ser un número"),

    check("numPax")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .isInt({ min: 0, max: 20 })
        .withMessage("El campo debe ser un número entre 0 y 20"),

    check("estadoPax")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .isIn(["Pendiente", "Aprobado", "En tránsito", "Completado"])
        .withMessage(
            'El campo "estadoPax" debe ser Pendiente, Aprobado, En tránsito o Completado'
        ),

    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        } else {
            return res.status(400).send({ errors: errors.array() });
        }
    },
];

const validacionBoletoAc = [
    check("user.nombre")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .customSanitizer((value) => value?.trim())
        .isLength({ min: 3, max: 20 })
        .withMessage('El campo "nombre" debe tener entre 3 y 20 caracteres')
        .isAlpha("es-ES", { ignore: "áéíóúÁÉÍÓÚñÑ" })
        .withMessage('El campo "nombre" debe contener solo letras')
        .isString()
        .withMessage("El campo debe ser una cadena de texto"),

    check("user.apellido")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .isLength({ min: 3, max: 20 })
        .withMessage('El campo "apellido" debe tener entre 3 y 20 caracteres')
        .isAlpha("es-ES", { ignore: "áéíóúÁÉÍÓÚñÑ" })
        .withMessage('El campo "apellido" debe contener solo letras'),

    check("user.phone")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .isNumeric()
        .withMessage("El campo debe ser un número")
        .isLength({ max: 10 })
        .withMessage("El número de teléfono no puede tener más de 10 dígitos"),

    check("ciudadSalida.ciudad")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .isAlpha("es-ES", { ignore: "áéíóúÁÉÍÓÚñÑ" })
        .withMessage("El campo debe ser una cadena de texto con solo letras"),

    check("ciudadSalida.direccion")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío"),

    check("ciudadLlegada.ciudad")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .isAlpha("es-ES", { ignore: "áéíóúÁÉÍÓÚñÑ" })
        .withMessage("El campo debe ser una cadena de texto con solo letras"),

    check("ciudadLlegada.direccion")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío"),

    check("distancia")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .isNumeric()
        .withMessage("El campo debe ser un número"),

    check("numPax")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .isInt({ min: 0, max: 20 })
        .withMessage("El campo debe ser un número entre 0 y 20"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        } else {
            return res.status(400).send({ errors: errors.array() });
        }
    },
];


const validacionPasajero = [
    check("pasajeroNombre")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .customSanitizer((value) => value?.trim())
        .isLength({ min: 3, max: 20 })
        .withMessage('El campo "nombre" debe tener entre 3 y 20 caracteres')
        .isAlpha("es-ES", { ignore: "áéíóúÁÉÍÓÚñÑ" })
        .withMessage('El campo "nombre" debe contener solo letras')
        .isString()
        .withMessage("El campo debe ser una cadena de texto"),

    check("pasajeroApellido")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .customSanitizer((value) => value?.trim())
        .isLength({ min: 3, max: 20 })
        .withMessage('El campo "apellido" debe tener entre 3 y 20 caracteres')
        .isAlpha("es-ES", { ignore: "áéíóúÁÉÍÓÚñÑ" })
        .withMessage('El campo "apellido" debe contener solo letras')
        .isString()
        .withMessage("El campo debe ser una cadena de texto"),

    check("correo")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .isEmail()
        .withMessage("El campo debe ser un correo electrónico válido")
        .customSanitizer((value) => value?.trim()),

    check("password")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .isLength({ min: 8 })
        .withMessage("La contraseña debe tener al menos 8 caracteres")
        .isString()
        .withMessage("El campo debe ser una cadena de texto")
        .not().matches(/\s/)
        .withMessage("La contraseña no puede contener espacios"),
    

    check("phone")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .isInt({ min: 0 })
        .withMessage("El campo debe ser un número entero positivo")
        .isLength({ max: 10 })
        .withMessage("El número de teléfono no puede tener más de 10 dígitos"),
    

    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        } else {
            return res.status(400).send({ errors: errors.array() });
        }
    },
];

const validacionInicioSesion = [
    check("correo")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .isEmail()
        .withMessage("El campo debe ser un correo electrónico válido")
        .customSanitizer((value) => value?.trim()),

    check("password")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .isLength({ min: 8 })
        .withMessage("La contraseña debe tener al menos 8 caracteres")
        .isString()
        .withMessage("El campo debe ser una cadena de texto")
        .not().matches(/\s/)
        .withMessage("La contraseña no puede contener espacios"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        } else {
            return res.status(400).send({ errors: errors.array() });
        }
    },
];



export { 
    validacionBoleto,
    validacionBoletoAc,
    validacionPasajero,
    validacionInicioSesion
};
