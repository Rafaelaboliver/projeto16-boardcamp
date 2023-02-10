import joi from "joi";

const gameSchema = joi.object({
name: joi.string().empty().required(),
image: joi.string().empty().required(),
stock_total: joi.number().positive().required(),
rice_per_day: joi.number().positive().required()
});

export default gameSchema;