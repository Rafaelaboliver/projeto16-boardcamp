import connection from "../config/database.js";

//display all games 
export async function displayAllGames(req, res) {
    try {
        const games = await connection.query('SELECT * FROM games;')
        res.status(200).send(games.rows);
    } catch (error) {
         return res.status(500).send('server error: ' + error)
    }
}

//add one game 
