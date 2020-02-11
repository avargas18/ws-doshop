'use strict'
const express = require('express')
const app = express()
const lang = require('../lang/es')
const constant = require('../util/constant')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')

let Category = require('../models').category

app.get('/', (req, res) => {
    let params = []
    Category.find({inactive: false}, (err, oCategories) => {
        if (err) {
            params[0] = lang.mstrGetCategoriesError.code,
            params[1] = constant.ResponseCode.error,
            params[2] = lang.mstrGetCategoriesError.message
        } else {
            params[0] = lang.mstrGetCategoriesSuccess.code,
            params[1] = constant.ResponseCode.success,
            params[2] = lang.mstrGetCategoriesSuccess.message,
            params[3] = oCategories
        }
        return res.jsonp(params)
    })
})
app.post('/', (request, response) => {
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
    let objCategory = {
        name: body.name,
        create_by: userAction,
        create_at: new Date()
    }
    objCategory.save((err, oCategory) => {
        if (err) {
            params[0] = lang.mstrErrorSaveObj.code,
            params[1] = constant.ResponseCode.error,
            params[3] = lang.mstrErrorSaveObj.message
        } else {
            params[0] = lang.mstrSaveObj.code,
            params[1] = constant.ResponseCode.success,
            params[2] = lang.mstrSaveObj.message,
            params[3] = oCategory
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
    let objCategory = {
        name: body.name,
        modified_by: userAction,
        modified_at: new Date()
    }
    Category.updateOne({_id: id}, objCategory, (err, success) => {
        if (err) {
            params[0] = lang.mstrCategoryNotFound.code,
            params[1] = constant.ResponseCode.error,
            params[2] = lang.mstrCategoryNotFound.message
        } else {
            params[0] = lang.mstrUpdateObj.code,
            params[1] = constant.ResponseCode.success,
            params[2] = lang.mstrUpdateObj.message,
            params[3] = success
        }
        response.jsonp(params)
    })
})
app.delete('/', auth, (request, response) => {
    let params = []
    let id = request.params.id
    Category.deleteOne({_id: id}, (err) => {
        if (err) {
            params[0] = lang.mstrCategoryNotFound.code,
            params[1] = constant.ResponseCode.error,
            params[2] = lang.mstrCategoryNotFound.message
        } else {
            params[2] = lang.mstrDeleteObj.code,
            params[1] = constant.ResponseCode.success,
            params[2] = lang.mstrDeleteObj.message
        }
        return response.jsonp(params)
    })
})

module.exports = app
