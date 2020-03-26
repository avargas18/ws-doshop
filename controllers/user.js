'use strict'

const express = require('express')
const app = express()
const lang = require('../lang/es')
const constant = require('../util/constant')
const bcrypt = require('bcrypt')
const auth = require('../middleware/auth')
const { decodedToken } = require('../util/util')

let User = require('../models').user

app.get('/', (req, res) => {
    let params = []
    User.find({inactive: false}, (err, oUsers) => {
        if (err) {
            params[0] = lang.mstrGetUsersError
            params[1] = constant.ResponseCode.error
            params[2] = `${lang.mstrGetUsersError.message} ${err}`
        } else {
            params[0] = lang.mstrGetUsersSuccess.code
            params[1] = constant.ResponseCode.success
            params[2] = lang.mstrGetUsersSuccess.message
            params[3] = oUsers
        }
        return res.jsonp(params)
    })
})
app.post('/', (req, res) => {
    let params = []
    let body = req.body
    let objUser = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role,
        create_by: body.create_by,
        create_at: new Date()
    })
    objUser.save((err, oUser) => {
        if (err) {
            params[0] = lang.mstrErrorSaveObj.code,
            params[1] = constant.ResponseCode.error,
            params[2] = `${lang.mstrErrorSaveObj.message} ${err}`
        } else {
            params[0] = lang.mstrSaveObj.code,
            params[1] = constant.ResponseCode.success,
            params[2] = lang.mstrSaveObj.message,
            params[3] = oUser
        }
        return res.jsonp(params)
    })
})
app.put('/:id', auth, (req, res) => {
    let params = []
    let id = req.params.id
    let body = req.body
    let token = req.query.token
    // decoded token
    let system_user = decodedToken(token)
    let objUser = {
        name: body.name,
        email: body.email,
        phone: body.phone,
        birth_date: body.birth_date,
        role: body.role,
        modified_by: system_user,
        modified_at: new Date()
    }
    User.updateOne({_id: id}, objUser, (err, success) => {
        if (err) {
            params[0] = lang.mstrUserNotFound.code,
            params[1] = constant.ResponseCode.error,
            params[2] = lang.mstrUserNotFound.message
        } else {
            params[0] = lang.mstrUpdateObj.code,
            params[1] = constant.ResponseCode.success,
            params[2] = lang.mstrUpdateObj.message
            params[3] = success
        }
        return res.jsonp(params)
    })
})
app.delete('/:id', auth, (req, res) => {
    let params = []
    let id = req.params.id
    User.deleteOne({_id: id}, (err) => {
        if (err) {
            params[0] = lang.mstrUserNotFound.code,
            params[1] = constant.ResponseCode.error,
            params[2] = lang.mstrUserNotFound.message
        } else {
            params[0] = lang.mstrDeleteObj.code,
            params[1] = constant.ResponseCode.success,
            params[2] = lang.mstrDeleteObj.message
        }
        return res.jsonp(params)
    })
})

module.exports = app
