import pkg from 'pg';

const {Pool} = pkg;

const connection = new Pool({
    user: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'boardcamp',
    password: 'Lulapresidente#13'
})

export default connection;