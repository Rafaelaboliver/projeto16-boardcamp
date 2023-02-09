import { Router } from "express";
import { displayAllGames } from "../controllers/games.js";

const gamesRoutes = Router();

//(route: GET/games)
gamesRoutes.get('/games', displayAllGames);

//(route: POST/games)

export default gamesRoutes;
