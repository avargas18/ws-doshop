'use strict'

const express = require('express')
const app = express()
const lang = require('../lang/es')
const constant = require('../util/constant')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')

let Store = require('../models').store

app.get('/', (request, response) => {
    let params = []
    Store.find({inactive: false}, (err, oStories) => {
        if (err) {
            params[0] = lang.mstrGetStoriesSuccess.code,
            params[1] = constant.ResponseCode.error,
            params[3] = lang.mstrGetStoriesSuccess.message
        } else {
            params[0] = lang.mstrGetStoriesError.code,
            params[1] = constant.ResponseCode.success,
            params[2] = lang.mstrGetStoriesError.message,
            params[3] = oStories
        }
        return response.jsonp(params)
    })
})
app.post('/', auth, (request, response) => {
    let params = []
    let body = request.body
    let token = request.query.token
    let userAction = {}
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return
        } else {
            userAction = decoded.user
            return userAction
        }
    })
    let objStore = {
        name: body.name,
        addresses: body.addresses,
        start: body.start,
        end: body.end,
        create_by: userAction,
        create_at: new Date()
    }
    objStore.save((err, oStore) => {
        if (err) {
            params[0] = lang.mstrErrorSaveObj.code,
            params[1] = constant.ResponseCode.error,
            params[2] = lang.mstrErrorSaveObj.message
        } else {
            params[0] = lang.mstrSaveObj.code,
            params[1] = constant.ResponseCode.success,
            params[2] = lang.mstrSaveObj.message,
            params[3] = oStore
        }
        return response.jsonp(params)
    })
})
app.put('/', auth, (request, response) => {
    let params = []
    let id = request.params.id
    let body = request.body
    let token = request.query.token
    let userAction = {}
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return
        } else {
            userAction = decoded.user
            return userAction
        }
    })
    let objStore = {
        name: body.name,
        addresses: body.addresses,
        start: body.start,
        end: body.end,
        modified_by: userAction,
        modified_at: new Date()
    }
    Store.updateOne({_id: id}, objStore, (err, success) => {
        if (err) {
            params[0] = lang.mstrStoreNotFound.code,
            params[1] = constant.ResponseCode.error,
            params[2] = lang.mstrStoreNotFound.message
        } else {
            params[0] = lang.mstrUpdateObj.code,
            params[1] = constant.ResponseCode.success,
            params[2] = lang.mstrUpdateObj.message
            params[3] = success
        }
        return response.jsonp(params)
    })
})
app.delete('/', auth, (request, response) => {
    let params = []
    let id = request.params.id
    Store.deleteOne({_id: id}, (err) => {
        if (err) {
            params[0] = lang.mstrStoreNotFound.code,
            params[1] = constant.ResponseCode.error,
            params[2] = lang.mstrStoreNotFound.message
        } else {
            params[0] = lang.mstrDeleteObj.code,
            params[1] = constant.ResponseCode.success,
            params[2] = lang.mstrDeleteObj.message
        }
        return response.jsonp(params)
    })
})

module.exports = app
