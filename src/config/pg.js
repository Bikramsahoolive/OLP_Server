require('dotenv').config();
const {Pool} = require('pg');

const pool = new Pool({
    user:process.env.pg_user,
    host:process.env.pg_host,
    port:process.env.pg_port,
    password:process.env.pg_password,
    database:process.env.pg_database
});

 pool.connect()
.catch((err)=>{
    console.log(err);
    
});

module.exports = {pool};