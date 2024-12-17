import express from 'express';
import postgresql from './postgresql.js';

// Instantiates a connection
postgresql(async (connection) => {});

// express
const app = express();

app.get('/pals', async (req, res) => {
    try{
        const rows = await process.postgresql.query('SELECT * FROM pals');
        res.status(200).send(JSON.stringify(rows));
    }
    catch(err){
        console.log(err);
    }
});

app.listen(3000, () => {
    console.log('App running at http://localhost:3000');
});