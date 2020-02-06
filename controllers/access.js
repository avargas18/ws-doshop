'use strict'

const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const lang = require('../lang/es')
const constant = require('../util/constant')
const app = express()

let User = require('../models').user

// Auth normal
app.post('/', (req, res) => {
    let params = []
    let body = req.body
    User.findOne({email: body.email}, (err, oUser) => {
        if (err) {
            params[0] = lang.mstrUserNotFound.code,
            params[1] = constant.ResponseCode.error
            params[2] = lang.mstrUserNotFound.message
        } else if (!oUser) {
            params[0] = lang.mstrInvalidCredentials.code,
            params[1] = constant.ResponseCode.error,
            params[2] = lang.mstrInvalidCredentials.message
        } else if (!bcrypt.compareSync(body.password, oUser.password)) {
            params[0] = lang.mstrInvalidCredentials.code,
            params[1] = constant.ResponseCode.error,
            params[2] = lang.mstrInvalidCredentials.message
        } else {
            oUser.password = ''
            // Generate access token
            let token = jwt.sign({user: oUser}, process.env.SEED,{expiresIn: 7200}) // 2 hours
            params[0] = lang.mstrAccessGranted.code,
            params[1] = constant.ResponseCode.success,
            params[2] = lang.mstrAccessGranted.message,
            params[3] = {token}
        }
        return res.jsonp(params)
    })
})

module.exports = app
