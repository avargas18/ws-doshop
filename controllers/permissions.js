'use strict'
const express = require('express')
const app = express()
const lang = require('../lang/es')
const constant = require('../util/constant')

let Permission = require('../models').permissions

app.get('/', (req, res) => {
    let params = []
    Permission.find({inactive: false}, (err, oPermissions) => {
        if (err) {
            params[0] = lang.mstrGetPermissionsError.code,
            params[1] = constant.ResponseCode.error,
            params[2] = lang.mstrGetPermissionsError.message
        } else {
            params[0] = lang.mstrGetPermissionsSuccess.code,
            params[1] = constant.ResponseCode.success,
            params[2] = lang.mstrGetPermissionsSuccess.message,
            params[3] = oPermissions
        }
        return res.jsonp(params)
    })
})

module.exports = app
