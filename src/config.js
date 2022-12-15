const {config} =require('dotenv');
config()


module.exports={
    db:{
        user: process.env.dbUser,
        password: process.env.dbPassword,
        host: process.env.dbHost,
        port: process.env.dbPort,
        database: process.env.dbDatabase
    }
}