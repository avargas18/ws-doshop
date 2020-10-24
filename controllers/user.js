'use strict'

const express = require('express')
const app = express()
const interfaces = require('../interfaces/index')
const lang = require('../lang/es')
const constant = require('../util/constant')
const bcrypt = require('bcrypt')
const authentication = require('../middleware/auth')
const utils = require('../util/util')
const methods = interfaces.user

app.get('/', (request, response) => {
    methods.get()
        .then((data) => {
            return response.status(200).send(utils.objectResponse(data))
        })
        .catch((err) => {
            return response.status(500).send(utils.objectResponse(err))
        })
})

app.get('/:id', (request, response) => {
    methods.findById(request)
        .then((data) => {
            return response.status(200).send(utils.objectResponse(data))
        })
        .catch((err) => {
            return  response.status(500).send(utils.objectResponse(err))
        })
})

app.post('/', (request, response) => {
    methods.add(request)
        .then((data) => {
            return response.status(200).send(utils.objectResponse(data))
        })
        .catch((err) => {
           return  response.status(500).send(utils.objectResponse(err))
        })
})

app.put('/:id', authentication, (request, response) => {
    methods.edit(request)
        .then((data) => {
            return response.status(200).send(utils.objectResponse(data))
        })
        .catch((err) => {
            return response.status(500).send(utils.objectResponse(err))
        })
})

app.delete('/:id', authentication, (request, response) => {
    methods.delete(request)
        .then((data) => {
            return response.status(200).send(utils.objectResponse(data))
        })
        .catch((err) => {
            return response.status(500).send(utils.objectResponse(err))
        })
})

module.exports = app
