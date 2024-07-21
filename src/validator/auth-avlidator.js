const Joi = require("joi");

exports.registerSchema = Joi.object({
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^[0-9]{10}$/),
  password: Joi.string()
    .required()
    .pattern(/^[a-zA-Z0-9]{6,}/),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).strip(),
  firstName: Joi.string().required().trim(),
  lastName: Joi.string().required().trim(),
  address: Joi.string().required().trim(),
});

exports.loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
