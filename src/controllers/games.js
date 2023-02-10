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
    const { name, image, stock_total, price_per_day } = req.body;
    try {
        //verify if game already exists
        const nameGame = await connection.query('SELECT name from games;');
        const verifyName = nameGame.rows.map(name => name);
        console.log(verifyName);
        if (verifyName === name) {
            return res.status(409);
        };

        const games = await connection.query(
            'INSERT INTO games (name, image, stock_total, price_per_day) VALUES ($1, $2, $3, $4)',
            [name, image, stock_total, price_per_day]
        );
        res.status(201).send(games.rows);
    } catch (error) {
        return res.status(500).send('server error' + error)
    };
}




