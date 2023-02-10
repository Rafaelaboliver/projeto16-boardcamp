import connection from "../config/database.js";

//displays the rents 
export async function displayRents(req, res) {
  try {

    const rentals = await connection.query(`WITH rental_game_customer AS (
        SELECT rentals.id, rentals."customerId", rentals."gameId", rentals."rentDate", rentals."daysRented", rentals."returnDate", rentals."originalPrice", rentals."delayFee",
               customers.id AS customer_id, customers.name AS customer_name,
               games.id AS game_id, games.name AS game_name
        FROM rentals
        JOIN customers ON rentals."customerId" = customers.id
        JOIN games ON rentals."gameId" = games.id
      )
      SELECT *
      FROM (
        SELECT
          id,
          "customerId",
          "gameId",
          "rentDate",
          "daysRented",
          "returnDate",
          "originalPrice",
          "delayFee",
          json_build_object('id', customer_id, 'name', customer_name) AS customer,
          json_build_object('id', game_id, 'name', game_name) AS game
        FROM rental_game_customer
      ) rental_game_customer;
      `);

    console.log(rentals.rows);
    res.status(200).send(rentals.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

//add a rent 
export async function addRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;
    const currentDate = new Date();
    const rentDate = currentDate.toISOString().split("T")[0];
    let originalPrice = 0;
    const returnDate = null;
    const delayFee = null;

    try {
      const game = await connection.query('SELECT * FROM games WHERE id = $1', [
        gameId,
      ]);
      const { pricePerDay } = game.rows[0];
      originalPrice = pricePerDay * daysRented;
  
      // Check if the customer is already registered
      const customer = await connection.query(
        'SELECT * FROM customers WHERE id = $1',
        [customerId]
      );
      const verifyCustomer = customer.rows[0] === 0;
      if (verifyCustomer) {
        return res.status(400).send('customer does not exist');
      }
  
      // Check if the game is available
      const gameAvailable = await connection.query(
        'SELECT * FROM games WHERE id = $1',
        [gameId]
      );
      const verifyGame = gameAvailable.rows[0] === 0;
      if (verifyGame) {
        return res.status(400).send("Game not found!");
      }
  
      const rental = await connection.query(
        'INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);',
        [
          customerId,
          gameId,
          rentDate,
          daysRented,
          returnDate,
          originalPrice,
          delayFee,
        ]
      );
      res.status(201).send();
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

//checkou a rent 

//delete a rent 
