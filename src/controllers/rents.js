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
export async function addRent(req, res) {
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
      console.log(game);
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
  
      // Check if the game exists
      const gameIsThere = await connection.query(
        'SELECT * FROM games WHERE id = $1',
        [gameId]
      );
      const verifyGame = gameIsThere.rows[0] === 0;
      if (verifyGame) {
        return res.status(400).send("Game not found!");
      }
  
      //Check if the game is available
      const checkGame = gameIsThere.rows[0].stockTotal;
      const gamesOut = await connection.query(
        'SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL', [gameId]
      );

      const gameOutNumber = gamesOut.rows.length;
      const available = checkGame > gameOutNumber;
      if(!available) {
        return res.status(400).send('Game not available');
      }

      await connection.query(
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
export async function updateRent(req, res) {
  const { id } = req.params;
  const currentDate = new Date();
  const rentReturn = currentDate.toISOString().split("T")[0];
  

  try {
    const rent = await connection.query(
      'SELECT * FROM rentals WHERE id = $1',
      [id]
    );
    const rentExists = rent.rowCount !== 0
    if (!rentExists) {
      return res.status(404).send("Rent does not exist!");
    }
    let check = rent.rows[0];

    const returned = check.returnDate;
    if (returned !== null) {
      return res.status(400).send("Rental already returned!");
    }

    const rentDate = new Date(check.rentDate);
    const daysRented = check.daysRented;
    const returnDate = new Date(rentReturn);
    const timeSpent = Math.abs(returnDate.getTime() - rentDate.getTime());
    const daySpent = Math.ceil(timeSpent / (1000 * 3600 * 24));
    const lagDays = daySpent - daysRented;
    let delayFee = 0;
    if (lagDays > 0) {
      const game = await connection.query('SELECT * FROM games WHERE id = $1', [
        rent.gameId,
      ]);
      const { pricePerDay } = game.rows[0];

      delayFee = lagDays * pricePerDay;
    }

    await connection.query(
      'UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3',
      [rentReturn, delayFee, id] 
    );

    res.status(200).send();
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

//delete a rent 
export async function deleteRent(req, res) {
  const { id } = req.params;

  try {
    const checkRent = await connection.query(
      'SELECT * FROM rentals WHERE id = $1',
      [id]
    );
    const rentExists = checkRent.rowCount !== 0;
    if (!rentExists) {
      return res.status(404).send("Rent does not exists!");
    }

    const rent = checkRent.rows[0];

    const returnRent = rent.returnDate;
    if (returnRent === null) {
      return res.status(400).send("This game has not been returned!");
    }

    await connection.query(
      'DELETE FROM rentals WHERE id = $1',
      [id]
    );

    res.status(200).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
}
