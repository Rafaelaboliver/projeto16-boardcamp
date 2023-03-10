import connection from "../config/database.js";

//list all customers
export async function displayAllCustomers(req, res) {
    try {
        const customers = await connection.query('SELECT * FROM customers;')
        res.status(200).send(customers.rows);
    } catch (error) {
        return res.status(500).send('server error: ' + error)
    };
}

//list a customer by id 
export async function displayCustomerId(req, res) {
    const { id } = req.params;

    try {
        const customer = await connection.query(
            'SELECT * FROM customers WHERE id = $1',
            [id]
        );

        const customerExists = customer.rowCount !== 0;
        if (!customerExists) {
            return res.status(404).send("Customer does not exist");
        }

        res.status(200).send(customer.rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

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

        await connection.query(
            'INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);',
            [name, phone, cpf, birthday]
        );
        res.sendStatus(201);
    } catch (error) {
        return res.status(500).send('server error' + error);
    }
}

//update a customer 
export async function updateCustomerData(req, res) {
    const { id } = req.params;
    const { name, cpf, phone, birthday } = req.body;

    try {
        const customer = await connection.query(
            'SELECT * FROM customers WHERE id = $1',
            [id]
        );

        const customerExists = customer.rowCount !== 0;
        if (!customerExists) {
            return res.status(404).send("Customer does not exist!");
        }

        const checkCpf = await connection.query(
            'SELECT * FROM customers WHERE cpf = $1 AND id <> $2',
            [cpf, id]
        );
        const cpfExists = checkCpf.rowCount > 0;
        if (cpfExists) {
            return res.status(409).send("CPF already exists");
        }

        await connection.query(
            'UPDATE customers SET name = $1, cpf = $2, phone = $3, birthday = $4 WHERE id = $5',
            [name, cpf, phone, birthday, id]
        );

        res.status(200).send("Customer's data updated");
    } catch (error) {
        res.status(500).send(error.message);
    }
}
