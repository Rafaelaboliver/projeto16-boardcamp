import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

const configDatabase = {
  connectionString: process.env.DATABASE_URL,
};

if (process.env.MODE === "prod") configDatabase.ssl = true;


const connection = new Pool(configDatabase);
export default connection;
