const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const collegeRoutes = require('./routes/college.routes')
const {config} =require('dotenv');
config()
 
const app = express();
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(collegeRoutes)

console.log('server en el RAIL')
