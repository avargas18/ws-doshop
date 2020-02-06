'use strict'

const jwt = require('jsonwebtoken')
const constant = require('../util/constant')
const lang = require('../lang/es')

// Decoded token
let checkToken = (req, res, next) => {
    let params = [] 
    let token = req.query.token
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            params[0] = lang.mstrInvalidToken.code,
            params[1] = constant.ResponseCode.error,
            params[2] = lang.mstrInvalidToken.message
            return res.jsonp(params)
        }
        req.user = decoded.user
        next()
    })
}

module.exports = checkToken
