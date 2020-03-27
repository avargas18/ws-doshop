'use strict'

const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const lang = require('../lang/es')
const constant = require('../util/constant')
const {OAuth2Client} = require('google-auth-library')
const google = new OAuth2Client(process.env.CLIENT_ID_GOOGLE)
const app = express()

let User = require('../models').user

// Auth google
async function verify(token) {
    const ticket = await google.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID_GOOGLE
    })
    const payload = ticket.getPayload()
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
        // payload
    }
}

app.post('/google', async (request, response) => {
    let params = []
    let token = request.body.token
    let googleUser = await verify(token)
        .catch(e => {
            params[0] = lang.mstrInvalidToken.code,
            params[1] = constant.ResponseCode.error,
            params[2] = lang.mstrInvalidToken.message
        })
    User.findOne({email: googleUser.email}, (err, oUser) => {
        if (err) {
            params[0] = lang.mstrUserNotFound.code,
            params[1] = constant.ResponseCode.error
            params[2] = lang.mstrUserNotFound.message
        }
        if (oUser) {
            if (!oUser.google) {
                params[0] = lang.mstrUseAuthNormal.code,
                params[1] = constant.ResponseCode.error
                params[2] = lang.mstrUseAuthNormal.message
            } else {
                let token = jwt.sign({user: oUser}, process.env.SEED, {expiresIn: process.env.EXP_TOKEN}) // 48h
                params[0] = lang.mstrAccessGranted.code,
                params[1] = constant.ResponseCode.success,
                params[2] = lang.mstrAccessGranted.message,
                params[3] = {token}
            }
        } else {
            // save user in the db
            let objUser = new User({
                name: googleUser.name,
                email: googleUser.email,
                password: ':)',
                img: googleUser.img,
                google: googleUser.google,
                create_at: new Date()
            })
            objUser.save((err, gUser) => {
                let token = jwt.sign({user: gUser}, process.env.SEED, {expiresIn: process.env.EXP_TOKEN}) // 48h
                if (err) {
                    params[0] = lang.mstrErrorSaveObj.code,
                    params[1] = constant.ResponseCode.error,
                    params[2] = `${lang.mstrErrorSaveObj.message} ${err}`
                } else {
                    params[0] = lang.mstrSaveObj.code,
                    params[1] = constant.ResponseCode.success,
                    params[2] = lang.mstrSaveObj.message,
                    params[3] = {token}
                }
            })
        }
        return response.jsonp(params)
    })
})

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
            let token = jwt.sign({user: oUser}, process.env.SEED, {expiresIn: process.env.EXP_TOKEN}) // 48h
            params[0] = lang.mstrAccessGranted.code,
            params[1] = constant.ResponseCode.success,
            params[2] = lang.mstrAccessGranted.message,
            params[3] = {token}
        }
        return res.jsonp(params)
    })
})

module.exports = app
