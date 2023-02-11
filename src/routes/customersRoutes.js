import { Router } from "express";
import { addCustomer, displayAllCustomers, displayCustomerId } from "../controllers/customers.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import customerSchema from "../schemas/customerSchemas.js";


const customerRouter = Router();

//(route: GET/customers)
customerRouter.get('/customers', displayAllCustomers);
//(route: GET/customers/:id)
customerRouter.get('/customers/:id', displayCustomerId);
//(route: POST/customers)
customerRouter.post('/customers', validateSchema(customerSchema), addCustomer);


//(route: PUT /customers/:id)

export default customerRouter;