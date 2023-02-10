import { Router } from "express";
import { addRental, displayRents } from "../controllers/rents.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import rentSchema from "../schemas/rentSchemas.js";

const rentRouter = Router();
//(route: GET /rentals)
rentRouter.get('/rentals', displayRents);
//(route: POST /rentals)
rentRouter.post('/rentals', validateSchema(rentSchema), addRental);

//(route: POST /rentals/:id/return)

//(route: DELETE /rentals/:id)

export default rentRouter;