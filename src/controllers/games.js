import connection from "../config/database.js";

//display all games 
export async function displayAllGames(req, res) {
    try {
        const games = await connection.query('SELECT * FROM games;')
        res.status(200).send(games.rows);
    } catch (error) {
        return res.status(500).send('server error: ' + error)
    };
}

//add one game 
export async function addGame(req, res) {
    const { name, image, stockTotal, pricePerDay } = req.body;
    try {
        //verify if game already exists
        const result = await connection.query(
            'SELECT * FROM games WHERE name = $1',
            [name]
        );
        const alreadyExists = result.rows.length > 0;
        if (alreadyExists) {
            return res.status(409).send('This game already exists: ' + name);
        }

        const games = await connection.query(
            'INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4)',
            [name, image, stockTotal, pricePerDay]
        );
        res.status(201).send();
    } catch (error) {
        return res.status(500).send('server error' + error)
    };
}




