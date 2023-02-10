import { Router } from "express";
import { displayAllGames, addGame } from "../controllers/games.js";
import {validateSchema} from '../middlewares/validateSchema.js';
import gameSchema from "../schemas/gameSchema.js";

const gamesRoutes = Router();

//(route: GET/games)
gamesRoutes.get('/games', displayAllGames);
gamesRoutes.post('/games', validateSchema(gameSchema), addGame);

export default gamesRoutes;
