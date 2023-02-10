import { Router } from "express";
import { addCustomer } from "../controllers/customers.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import customerSchema from "../middlewares/customerSchema.js";

const customerRouter = Router();

//(route: GET/customers)

//(route: GET/customers/:id)

//(route: POST/customers)
customerRouter.post('/customers', validateSchema(customerSchema), addCustomer);


//(route: PUT /customers/:id)