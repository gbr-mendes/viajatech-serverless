const Joi = require('joi')

const validateEmployeeInfo = Joi.object({
    salary: Joi.number()
        .required()
        .min(1500)
        .messages({
            'any.required': 'O campo salário é obrigatório',
            'number.base': 'O campo salario precisa ser númerico',
            'number.min': 'O salário precisa ser de no mínimo R$ 1.500,00'
        }),
    position: Joi.string()
        .valid('General Manager', 'Sales Manager', 'Content Manager')
        .required()
        .messages({
            'any.required': 'O campo posição é obrigatório ',
            'string.empty': 'O campo posição é obrigatório',
            'any.only': 'O campo posição deve ser uma dentre as seguinte opções: General Manager, Sales Manager, Content Manager'
        })
})

module.exports = validateEmployeeInfo