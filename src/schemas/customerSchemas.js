import joi from "joi";

const customerSchema = joi.object({
    name: joi.string().empty().required(),
    phone: joi.string().min(10).max(11).required().uri(),
    cpf: joi.string().length(11).required(),
    birthday: joi.date().max('now').required()
    });
    
    export default customerSchema;
