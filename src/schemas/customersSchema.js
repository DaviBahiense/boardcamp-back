import joi from 'joi'

const customersSchemaRules = joi.object({
    name: joi.string(),
    phone: joi.string().pattern(new RegExp(/^[0-9]{10,11}/)).label('fone'),
    cpf: joi.string().pattern(/^[0-9]{11}$/).label('cpf'),  
    birthday: joi.date().required()
})

const customersSchema = joi.object({
    name: joi.string().required(),
    phone: joi.number().required(),
    cpf: joi.number().required(),
    birthday: joi.string().required()
})

export { customersSchema, customersSchemaRules }