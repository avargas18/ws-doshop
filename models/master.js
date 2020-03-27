'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const masterSchema = new Schema({
    code: { type: String },
    value1: { type: String },
    value2: { type: String },
    create_by: { type: Object },
    create_at: { type: Date },
    inactive: { type: Boolean }
})

module.exports = mongoose.model('master', masterSchema)
