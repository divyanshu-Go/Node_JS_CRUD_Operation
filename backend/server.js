const express = require('express');
const bodyParser = require('body-parser')
require('dotenv').config();

const DB = require('./DB/db');
const PersonRoute = require('./ROUTE/personRoutes')
const Person = require('./MODEL/person')
const passport = require('./AUTHEN/auth')


const app = express()
app.use(bodyParser.json());
app.use('/', PersonRoute)
app.use(passport.initialize())



app.listen(5000, () => {
    console.log('Server is running on port 5000...')
})