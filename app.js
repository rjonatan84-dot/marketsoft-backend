const express = require('express');
const sequelize = require('./src/config/database');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running successfully')
})

app.listen(PORT, () =>{
    console.log(`Server running at http://localhost:${PORT}`)
});

sequelize.authenticate()
    .then(()=> {
        console.log('Database connection established successfully')
    })
    .catch((error)=>{
        console.error('Unable to connect to the database', error);
    });