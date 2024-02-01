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
        .matches(/^[a-záéíóúñ\s]*$/i)
        .withMessage("El campo debe ser una cadena de texto con solo letras y espacios"),

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
        .matches(/^[a-záéíóúñ\s]*$/i)
        .withMessage("El campo debe ser una cadena de texto con solo letras y espacios"),

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
        .isAlpha("es-ES", { ignore: "áéíóúÁÉÍÓÚñÑ " })
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
        .isAlpha("es-ES", { ignore: "áéíóúÁÉÍÓÚñÑ " })
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
        .not()
        .matches(/\s/)
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
        .not()
        .matches(/\s/)
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




const validacionConductor = [
    check("conductorNombre")
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

    check("conductorApellido")
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

    check("cedula")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .isInt({ min: 0, max: 9999999999 })
        .withMessage("El campo debe ser un número entero positivo de hasta 10 dígitos"),


    check("correo")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .isEmail()
        .withMessage("El campo debe ser un correo electrónico válido"),

    check("password")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .isLength({ min: 8 })
        .withMessage("El campo debe tener al menos 8 caracteres"),

    check("phone")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .isInt({ min: 0, max: 9999999999 })
        .withMessage("El campo debe ser un número entero positivo de hasta 10 dígitos"),

    check("marcaVehiculo")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .customSanitizer((value) => value?.trim())
        .isLength({ min: 3, max: 20 })
        .withMessage('El campo "marcaVehiculo" debe tener entre 3 y 20 caracteres')
        .isAlpha("es-ES", { ignore: "áéíóúÁÉÍÓÚñÑ" })
        .withMessage('El campo "marcaVehiculo" debe contener solo letras')
        .isString()
        .withMessage("El campo debe ser una cadena de texto"),

    check("modeloVehiculo")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .customSanitizer((value) => value?.trim())
        .isLength({ min: 3, max: 20 })
        .withMessage('El campo "modeloVehiculo" debe tener entre 3 y 20 caracteres')
        .isAlpha("es-ES", { ignore: "áéíóúÁÉÍÓÚñÑ" })
        .withMessage('El campo "modeloVehiculo" debe contener solo letras')
        .isString()
        .withMessage("El campo debe ser una cadena de texto"),

    check("anioVehiculo")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .isInt({ min: 0, max: 9999 })
        .withMessage("El campo debe ser un número entero positivo de hasta 4 dígitos"),


    check("colorVehiculo")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .customSanitizer((value) => value?.trim())
        .isLength({ min: 3, max: 20 })
        .withMessage('El campo "colorVehiculo" debe tener entre 3 y 20 caracteres')
        .isAlpha("es-ES", { ignore: "áéíóúÁÉÍÓÚñÑ" })
        .withMessage('El campo "colorVehiculo" debe contener solo letras')
        .isString()
        .withMessage("El campo debe ser una cadena de texto"),

    check("numeroAsientos")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .isInt({ min: 1, max: 20 })
        .withMessage("El campo debe ser un número entero positivo entre 1 y 20"),

    check("placaVehiculo")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        } else {
            return res.status(400).send({ errors: errors.array() });
        }
    },
];




const validacionRutaHorario = [
    check("ruta.nombre")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim()
        .isLength({ min: 5, max: 20 }).withMessage('El campo "nombre" debe tener entre 5 y 50 caracteres')
        .matches(/^[a-zA-Z\s]*$/).withMessage("El campo debe contener solo letras"),

    check("ruta.ciudad1")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim()
        .isLength({ min: 5, max: 20 }).withMessage('El campo "ciudad1" debe tener entre 5 y 20 caracteres')
        .matches(/^[a-zA-Z\s]*$/).withMessage("El campo debe contener solo letras"),

    check("ruta.ciudad2")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim()
        .isLength({ min: 5, max: 20 }).withMessage('El campo "ciudad2" debe tener entre 5 y 20 caracteres')
        .matches(/^[a-zA-Z\s]*$/).withMessage("El campo debe contener solo letras"),

    check("horario.horario1")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim(),

    check("horario.horario2")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim(),

    check("horario.horario3")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim(),
];




const validacionServicio = [
    check("nombreServicio")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage('El campo "nombreServicio" debe tener entre 3 y 50 caracteres')
        .matches(/^[a-zA-Z\s]*$/).withMessage("El campo debe contener solo letras")
        .not().matches(/\d/).withMessage('El campo no debe contener números'),

    check("detalleServicio")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim()
        .isLength({ min: 3, max: 200 }).withMessage('El campo "detalleServicio" debe tener entre 3 y 200 caracteres')
        .matches(/^[a-zA-Z\s]*$/).withMessage("El campo debe contener solo letras")
        .not().matches(/\d/).withMessage('El campo no debe contener números'),

    check("valorEstimado")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .isNumeric().withMessage("El campo debe ser un número")
        .isFloat({ min: 0 }).withMessage("El campo debe ser un número mayor o igual a 0"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        } else {
            return res.status(400).send({ errors: errors.array() });
        }
    },
];



const validacionEncomienda = [
    // Validaciones para remitente
    check("remitente.nombre")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim()
        .isLength({ min: 3, max: 20 }).withMessage('El campo "remitente.nombre" debe tener entre 3 y 20 caracteres')
        .matches(/^[a-zA-Z]+$/).withMessage("El campo debe contener solo letras"),

    check("remitente.apellido")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim()
        .isLength({ min: 3, max: 20 }).withMessage('El campo "remitente.apellido" debe tener entre 3 y 20 caracteres')
        .matches(/^[a-zA-Z]+$/).withMessage("El campo debe contener solo letras"),

    check("remitente.phone")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim()
        .isNumeric().withMessage("El campo debe ser un número")
        .isLength({ max: 10 }).withMessage("El campo debe tener como máximo 10 dígitos"),


    check("destinatario.nombre")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim()
        .isLength({ min: 3, max: 20 }).withMessage('El campo "destinatario.nombre" debe tener entre 3 y 20 caracteres')
        .matches(/^[a-zA-Z]+$/).withMessage("El campo debe contener solo letras"),

    check("destinatario.apellido")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim()
        .isLength({ min: 3, max: 20 }).withMessage('El campo "destinatario.apellido" debe tener entre 3 y 20 caracteres')
        .matches(/^[a-zA-Z]+$/).withMessage("El campo debe contener solo letras"),

    check("destinatario.phone")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim()
        .isNumeric().withMessage("El campo debe ser un número")
        .isLength({ max: 10 }).withMessage("El campo debe tener como máximo 10 dígitos"),


    // Validaciones para ciudadRemitente
    check("ciudadRemitente.ciudad")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim() // Agregado para eliminar espacios al comienzo y al final
        .isLength({ min: 3, max: 50 }).withMessage('El campo "ciudadRemitente.ciudad" debe tener entre 3 y 50 caracteres')
        .matches(/^[a-zA-Z\s]*$/).withMessage("El campo debe contener solo letras"),

    check("ciudadRemitente.latitud")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('El campo "latitud" debe tener entre 3 y 100 caracteres')
        .matches(/^[0-9.-]+$/).withMessage("El campo debe contener solo números, puntos y guiones"),

    check("ciudadRemitente.longitud")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('El campo "longitud" debe tener entre 3 y 100 caracteres')
        .matches(/^[0-9.-]+$/).withMessage("El campo debe contener solo números, puntos y guiones"),

    check("ciudadRemitente.direccion")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío"),

    // Validaciones para ciudadDestinatario
    check("ciudadDestinatario.ciudad")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío"),

    check("ciudadDestinatario.latitud")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('El campo "latitud" debe tener entre 3 y 100 caracteres')
        .matches(/^[0-9.-]+$/).withMessage("El campo debe contener solo números, puntos y guiones"),

    check("ciudadDestinatario.longitud")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('El campo "longitud" debe tener entre 3 y 100 caracteres')
        .matches(/^[0-9.-]+$/).withMessage("El campo debe contener solo números, puntos y guiones"),

    check("ciudadDestinatario.direccion")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('El campo "direccion" debe tener entre 3 y 100 caracteres'),


    // Validaciones para numPaquetes
    check("numPaquetes")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .isNumeric().withMessage("El campo debe ser un número"),

    // Validaciones para turno
    check("turno.horario")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim(),

    check("turno.fecha")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .isISO8601().withMessage("El campo debe ser una fecha ISO8601 válida"),

    // Validaciones para precio
    check("precio")
        .optional()
        .trim()
        .isNumeric().withMessage("El campo debe ser un número"),

    // Validaciones para distancia
    check("distancia")
        .optional()
        .trim()
        .isNumeric().withMessage("El campo debe ser un número"),

    // Validaciones para estadoPaquete
    check("estadoPaquete")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .isIn(['Pendiente']).withMessage('El campo debe ser uno de los siguientes: "Pendiente",'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        } else {
            return res.status(400).send({ errors: errors.array() });
        }
    },
];



const conductorUpdateAdmin = [
    check("conductorNombre")
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

    check("conductorApellido")
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

    check("cedula")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .isInt({ min: 0, max: 9999999999 })
        .withMessage("El campo debe ser un número entero positivo de hasta 10 dígitos"),


    check("phone")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .isInt({ min: 0, max: 9999999999 })
        .withMessage("El campo debe ser un número entero positivo de hasta 10 dígitos"),

    check("marcaVehiculo")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .customSanitizer((value) => value?.trim())
        .isLength({ min: 3, max: 20 })
        .withMessage('El campo "marcaVehiculo" debe tener entre 3 y 20 caracteres')
        .isAlpha("es-ES", { ignore: "áéíóúÁÉÍÓÚñÑ" })
        .withMessage('El campo "marcaVehiculo" debe contener solo letras')
        .isString()
        .withMessage("El campo debe ser una cadena de texto"),

    check("modeloVehiculo")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .customSanitizer((value) => value?.trim())
        .isLength({ min: 3, max: 20 })
        .withMessage('El campo "modeloVehiculo" debe tener entre 3 y 20 caracteres')
        .isAlpha("es-ES", { ignore: "áéíóúÁÉÍÓÚñÑ" })
        .withMessage('El campo "modeloVehiculo" debe contener solo letras')
        .isString()
        .withMessage("El campo debe ser una cadena de texto"),

    check("anioVehiculo")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .isInt({ min: 0, max: 9999 })
        .withMessage("El campo debe ser un número entero positivo de hasta 4 dígitos"),


    check("colorVehiculo")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .customSanitizer((value) => value?.trim())
        .isLength({ min: 3, max: 20 })
        .withMessage('El campo "colorVehiculo" debe tener entre 3 y 20 caracteres')
        .isAlpha("es-ES", { ignore: "áéíóúÁÉÍÓÚñÑ" })
        .withMessage('El campo "colorVehiculo" debe contener solo letras')
        .isString()
        .withMessage("El campo debe ser una cadena de texto"),

    check("numeroAsientos")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío")
        .isInt({ min: 1, max: 20 })
        .withMessage("El campo debe ser un número entero positivo entre 1 y 20"),

    check("placaVehiculo")
        .exists()
        .withMessage("El campo es obligatorio")
        .notEmpty()
        .withMessage("El campo no puede estar vacío"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        } else {
            return res.status(400).send({ errors: errors.array() });
        }
    },
];


const validateEncomiendaUpdate = [
    // Validaciones para remitente
    check("remitente.nombre")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim()
        .isLength({ min: 3, max: 20 }).withMessage('El campo "remitente.nombre" debe tener entre 3 y 20 caracteres')
        .matches(/^[a-zA-Z]+$/).withMessage("El campo debe contener solo letras"),

    check("remitente.apellido")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim()
        .isLength({ min: 3, max: 20 }).withMessage('El campo "remitente.apellido" debe tener entre 3 y 20 caracteres')
        .matches(/^[a-zA-Z]+$/).withMessage("El campo debe contener solo letras"),

    check("remitente.phone")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim()
        .isNumeric().withMessage("El campo debe ser un número")
        .isLength({ max: 10 }).withMessage("El campo debe tener como máximo 10 dígitos"),


    check("destinatario.nombre")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim()
        .isLength({ min: 3, max: 20 }).withMessage('El campo "destinatario.nombre" debe tener entre 3 y 20 caracteres')
        .matches(/^[a-zA-Z]+$/).withMessage("El campo debe contener solo letras"),

    check("destinatario.apellido")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim()
        .isLength({ min: 3, max: 20 }).withMessage('El campo "destinatario.apellido" debe tener entre 3 y 20 caracteres')
        .matches(/^[a-zA-Z]+$/).withMessage("El campo debe contener solo letras"),

    check("destinatario.phone")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim()
        .isNumeric().withMessage("El campo debe ser un número")
        .isLength({ max: 10 }).withMessage("El campo debe tener como máximo 10 dígitos"),


    // Validaciones para ciudadRemitente
    check("ciudadRemitente.ciudad")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim() // Agregado para eliminar espacios al comienzo y al final
        .isLength({ min: 3, max: 50 }).withMessage('El campo "ciudadRemitente.ciudad" debe tener entre 3 y 50 caracteres')
        .matches(/^[a-zA-Z\s]*$/).withMessage("El campo debe contener solo letras"),

    check("ciudadRemitente.latitud")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('El campo "latitud" debe tener entre 3 y 100 caracteres')
        .matches(/^[0-9.-]+$/).withMessage("El campo debe contener solo números, puntos y guiones"),

    check("ciudadRemitente.longitud")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('El campo "longitud" debe tener entre 3 y 100 caracteres')
        .matches(/^[0-9.-]+$/).withMessage("El campo debe contener solo números, puntos y guiones"),

    check("ciudadRemitente.direccion")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío"),


    // Validaciones para ciudadDestinatario
    check("ciudadDestinatario.ciudad")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío"),


    check("ciudadDestinatario.latitud")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('El campo "latitud" debe tener entre 3 y 100 caracteres')
        .matches(/^[0-9.-]+$/).withMessage("El campo debe contener solo números, puntos y guiones"),

    check("ciudadDestinatario.longitud")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('El campo "longitud" debe tener entre 3 y 100 caracteres')
        .matches(/^[0-9.-]+$/).withMessage("El campo debe contener solo números, puntos y guiones"),

    check("ciudadDestinatario.direccion")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('El campo "direccion" debe tener entre 3 y 100 caracteres'),


    // Validaciones para numPaquetes
    check("numPaquetes")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .isNumeric().withMessage("El campo debe ser un número"),

    // Validaciones para turno
    check("turno.horario")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .trim(),

    check("turno.fecha")
        .exists().withMessage("El campo es obligatorio")
        .notEmpty().withMessage("El campo no puede estar vacío")
        .isISO8601().withMessage("El campo debe ser una fecha ISO8601 válida"),

    // Validaciones para precio
    check("precio")
        .optional()
        .trim()
        .isNumeric().withMessage("El campo debe ser un número"),

    // Validaciones para distancia
    check("distancia")
        .optional()
        .trim()
        .isNumeric().withMessage("El campo debe ser un número"),

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
    validacionInicioSesion,
    validacionConductor,
    validacionRutaHorario,
    validacionServicio,
    validacionEncomienda,
    conductorUpdateAdmin,
    validateEncomiendaUpdate
};
