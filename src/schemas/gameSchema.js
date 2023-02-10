import joi from "joi";

const gameSchema = joi.object({
name: joi.string().empty().required(),
image: joi.string().empty().required().uri(),
stock_total: joi.number().positive().required(),
price_per_day: joi.number().positive().required()
});

export default gameSchema;