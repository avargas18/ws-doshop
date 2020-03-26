'use strict'

const express = require('express')
const app = express()
const lang = require('../lang/es')
const constant = require('../util/constant')
const auth = require('../middleware/auth')
const { decodedToken } = require('../util/util')

let Product = require('../models').product

app.get('/', (req, res) => {
    let params = []
    Product.find({inactive: false}, (err, oProducts) => {
        if (err) {
            params[0] = lang.mstrGetProductsError.code,
            params[1] = constant.ResponseCode.error,
            params[2] = lang.mstrGetProductsError.message
        } else {
            params[0] = lang.mstrGetProductsSuccess.code,
            params[1] = constant.ResponseCode.success,
            params[2] = lang.mstrGetProductsSuccess.message,
            params[3] = oProducts
        }
        return res.jsonp(params)
    })
})
app.post('/', auth, (request, response) => {
    let params = []
    let body = request.body
    let token = request.query.token
    // decoded token
    let system_user = decodedToken(token)
    let objProduct = new Product({
        name: body.name,
        category: body.category,
        store: body.store,
        stock: body.stock,
        price: body.price,
        images: body.images,
        description: body.description,
        tags: body.tags,
        create_by: system_user,
        create_at: new Date()
    })
    objProduct.save((err, oProduct) => {
        if (err) {
            params[0] = lang.mstrErrorSaveObj.code,
            params[1] = constant.ResponseCode.error,
            params[2] = lang.mstrErrorSaveObj.message
        } else {
            params[0] = lang.mstrSaveObj.code,
            params[1] = constant.ResponseCode.success,
            params[2] = lang.mstrSaveObj.message,
            params[3] = oProduct
        }
        return response.jsonp(params)
    })
})
app.put('/:id', auth, (request, response) => {
    let params = []
    let id = request.params.id
    let body = request.body
    let token = request.query.token
    // decoded token
    let system_user = decodedToken(token)
    let objProduct = {
        name: body.name,
        category: body.category,
        store: body.store,
        stock: body.stock,
        price: body.price,
        images: body.images,
        description: body.description,
        tags: body.tags,
        modified_by: system_user,
        modified_at: new Date()
    }
    Product.updateOne({_id: id}, objProduct, (err, success) => {
        if (err) {
            params[0] = lang.mstrProductNotFound.code,
            params[1] = constant.ResponseCode.error,
            params[2] = lang.mstrProductNotFound.message
        } else {
            params[0] = lang.mstrUpdateObj.code,
            params[1] = constant.ResponseCode.success,
            params[2] = lang.mstrUpdateObj.message,
            params[3] = success
        }
        return response.jsonp(params)
    })
})
app.delete('/:id', auth, (request, response) => {
    let params = []
    let id = request.params.id
    Product.deleteOne({_id: id}, (err) => {
        if (err) {
            params[0] = lang.mstrProductNotFound.code,
            params[1] = constant.ResponseCode.error,
            params[2] = lang.mstrProductNotFound.message
        } else {
            params[0] = lang.mstrDeleteObj.code,
            params[1] = constant.ResponseCode.success,
            params[2] = lang.mstrDeleteObj.code
        }
        return response.jsonp(params)
    })
})

module.exports = app
