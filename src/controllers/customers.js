import connection from "../config/database";

//list all customers 

//list a customer by id 

//add a customer
export async function addCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        //verify if the customer's CPF already exists
        const result = await connection.query(
            'SELECT * FROM customers WHERE cpf = $1',
            [cpf]
        );
        const verifyCpf = result.rows.length > 0;
        if (verifyCpf) {
            return res.status(409).send("This CPF already exists");
        }

        const customer = await db.query(
            'INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);',
        [name, phone, cpf, birthday]
      );
        res.sendStatus(201);
    } catch (error) {
        return res.status(500).send('server error' + error);
    }
}

//update a customer 