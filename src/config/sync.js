const sequelize = require('./database');
require('../models/index.model');

class DatabaseSync{
    static async sync() {
        try{
            await sequelize.authenticate()
                .then(()=> {
                console.log('Database connection established successfully')
                })
                .catch((error)=>{
                console.error('Unable to connect to the database', error);
                });
            await sequelize.sync({ alter: false });
            console.log('Database synchronized succesfully');

        } catch (error){
            console.error('Error synchronized  the database', error);
        }
    }
}

module.exports = DatabaseSync;