import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import gamesRoutes from './routes/gamesRoutes.js';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use([gamesRoutes]);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
