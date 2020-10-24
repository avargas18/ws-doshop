'use strict'

const lang = require('../lang/es')
const constant = require('../util/constant')
const models = require('../models')
const Permission = models.permissions

const methods = {
    get() {
        const promise = new Promise((resolve, reject) => {
            let params = []
            Permission.find({inactive: false}, (err, oPermissions) => {
                if (err) {
                    params[0] = lang.mstrGetPermissionsError.code,
                    params[1] = constant.ResponseCode.error,
                    params[2] = lang.mstrGetPermissionsError.message
                    reject(params)
                } else {
                    params[0] = lang.mstrGetPermissionsSuccess.code,
                    params[1] = constant.ResponseCode.success,
                    params[2] = lang.mstrGetPermissionsSuccess.message,
                    params[3] = oPermissions
                    resolve(params)
                }
            })
        })
        return promise
    },
}

module.exports = methods
