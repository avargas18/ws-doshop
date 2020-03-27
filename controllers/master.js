'use strict'
const express = require('express')
const app = express()
const lang = require('../lang/es')
const constant = require('../util/constant')

let Master = require('../models').master

app.get('/', (req, res) => {
    let params = []
    Master.find({inactive: false}, (err, oMasters) => {
        if (err) {
            params[0] = lang.mstrGetMastersError.code,
            params[1] = constant.ResponseCode.error,
            params[2] = lang.mstrGetMastersError.message
        } else {
            params[0] = lang.mstrGetMastersSuccess.code,
            params[1] = constant.ResponseCode.success,
            params[2] = lang.mstrGetMastersSuccess.message,
            params[3] = oMasters
        }
        return res.jsonp(params)
    })
})

module.exports = app
