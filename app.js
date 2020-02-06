'use strict'

const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const route = require('./routes/index')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())
app.use(route)
app.use('/static', express.static(__dirname + '/public'))

module.exports = app
