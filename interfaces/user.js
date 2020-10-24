'use strict'

const models = require('../models')
const lang = require('../lang/es.json')
const constant = require('../util/constant')
const bcrypt = require('bcrypt')
const utils = require('../util/util')
const User = models.user

const methods = {
    get() {
        const promise = new Promise((resolve, reject) => {
            let params = []
            User.find({}, (err, oUsers) => {
                if (err) {
                    params[0] = lang.mstrGetUsersError.code,
                    params[1] = constant.ResponseCode.error,
                    params[2] = `${lang.mstrGetUsersError.message} ${err}`
                    reject(params)
                } else {
                    params[0] = lang.mstrGetUsersSuccess.code,
                    params[1] = constant.ResponseCode.success,
                    params[2] = lang.mstrGetUsersSuccess.message,
                    params[3] = oUsers
                    resolve(params)
                }
            })
        })
        return promise
    },
    add(request)  {
        const promise = new Promise((resolve, reject) => {
            let params = []
            let body = request.body
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
                    reject(params)
                } else {
                    params[0] = lang.mstrSaveObj.code,
                    params[1] = constant.ResponseCode.success,
                    params[2] = lang.mstrSaveObj.message,
                    params[3] = oUser
                    resolve(params)
                }
            })
        })
        return promise
    },
    edit(request) {
        const promise = new Promise((resolve, reject) => {
            let params = []
            let id = request.params.id
            let body = request.body
            let token = request.query.token
            // decoded token
            let system_user = utils.decodedToken(token)
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
                    reject(params)
                } else {
                    params[0] = lang.mstrUpdateObj.code,
                    params[1] = constant.ResponseCode.success,
                    params[2] = lang.mstrUpdateObj.message
                    params[3] = success
                    resolve(params)
                }
            })
        })
        return promise
    },
    delete(request) {
        const promise = new Promise((resolve, reject) => {
            let params = []
            let id = request.params.id
            User.deleteOne({_id: id}, (err) => {
                if (err) {
                    params[0] = lang.mstrUserNotFound.code,
                    params[1] = constant.ResponseCode.error,
                    params[2] = lang.mstrUserNotFound.message
                    reject(params)
                } else {
                    params[0] = lang.mstrDeleteObj.code,
                    params[1] = constant.ResponseCode.success,
                    params[2] = lang.mstrDeleteObj.message
                    resolve(params)
                }
            })
        })
        return promise
    },
    findById(request) {
        const promise = new Promise((resolve, reject) => {
            let params = []
            let id = request.params.id
            User.findById({_id: id})
                .populate('modified_by')
                .exec((err, oUser) => {
                    if (err) {
                        params[0] = lang.mstrUserNotFound.code,
                        params[1] = constant.ResponseCode.error,
                        params[2] = `${lang.mstrUserNotFound.message} ${err}`
                        reject(params)
                    } else {
                        params[0] = lang.mstrUserFound.code,
                        params[1] = constant.ResponseCode.success,
                        params[2] = lang.mstrUserFound.message,
                        params[3] = oUser
                        resolve(params)
                    }
                })
        })
        return promise
    }
}

module.exports = methods
