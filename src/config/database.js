import pg from 'pg';

const {Pool} = pg;

const connection = new Pool({
    user: 'postgres',
    host: 'localhost',
    port: 5432,
    database: '',
    password: 'Lulapresidente#13'
})

export default connection;