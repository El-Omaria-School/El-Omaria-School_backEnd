require('dotenv').config()
require('./db')
const cors = require('cors')

const express = require('express')
const app = express()

const mainRouter = express.Router()

app.use(express.json())
app.use(cors())
app.use('/api/v1', mainRouter)

