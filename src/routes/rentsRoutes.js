import { Router } from "express";
import { addRent, deleteRent, displayRents, updateRent } from "../controllers/rents.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import rentSchema from "../schemas/rentSchemas.js";

const rentRouter = Router();

//(route: GET /rentals)
rentRouter.get('/rentals', displayRents);
//(route: POST /rentals)
rentRouter.post('/rentals', validateSchema(rentSchema), addRent);
//(route: POST /rentals/:id/return)
rentRouter.post('/rentals/:id/return', updateRent);
//(route: DELETE /rentals/:id)
rentRouter.delete('/rentals/:id', deleteRent);

export default rentRouter;