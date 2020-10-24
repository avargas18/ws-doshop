'use strict'
const express = require('express')
const app = express()
const interfaces = require('../interfaces/index')
const utils = require('../util/util')
const methods = interfaces.permissions

app.get('/', (request, response) => {
    methods.get()
        .then((data) => {
            return response.status(200).send(utils.objectResponse(data))
        })
        .catch((err) => {
            return response.status(500).send(utils.objectResponse(err))
        })
})

module.exports = app
