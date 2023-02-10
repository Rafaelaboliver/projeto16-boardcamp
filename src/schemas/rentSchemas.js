import joi from "joi";

const rentSchema = joi.object({
    daysRented: joi.number().greater(0).required(),
    customerId: joi.number().greater(0).required(),
    gameId: joi.number().greater(0).required(),
})

export default rentSchema;