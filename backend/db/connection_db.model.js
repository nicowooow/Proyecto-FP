import {Pool} from 'pg';

import {DB_PORT,DB_HOST,DB_USER,DB_PASSWD,DB_DATABASE} from '../config/config.js'
console.log(DB_PORT,DB_HOST,DB_USER,DB_PASSWD,DB_DATABASE);
const pool= new Pool({
    port:DB_PORT,
    host:DB_HOST,
    user:DB_USER,
    password:DB_PASSWD,
    database:DB_DATABASE
})

pool.connect() //me da la conexion que busco a la BBFF 
  .then(client => { // si se logra la conexion con el cliente(en este caso PostgreSQL) me imprime que se logro la conexion
    console.log("Connected to PostgreSQL");
    client.release(); // lo hacemos para devolver la conexion del pool, para que no quede ocupada
  })
  .catch(error => {// sino el catch agarra el error y luego lo muestra por consola cual fue el error
    console.error("Connection error", error.stack);
  });

export default pool;