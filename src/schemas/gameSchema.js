import joi from "joi";

const gameSchema = joi.object({
name: joi.string().empty().required(),
image: joi.string().empty().required().uri(),
stockTotal: joi.number().positive().required(),
pricePerDay: joi.number().positive().required()
});

export default gameSchema;
