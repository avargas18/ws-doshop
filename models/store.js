'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const coordinateSchema = new Schema({
    latitude: { type: Number },
    longitude: { type: Number }
})

const addressSchema = new Schema({
    name: { type: String },
    reference: { type: String },
    principal: { type: Boolean },
    mobile: { type: String },
    coordinates: coordinateSchema
})

const storeSchema = new Schema({
    name: { type: String },
    addresses: [addressSchema],
    start: { type: String },
    end: { type: String },
    create_by: { type: Object },
    create_at: { type: Date },
    modified_by: { type: Object },
    modified_at: { type: Date },
    inactive: { type: Boolean, default: false }
})

module.exports = mongoose.model('Store', storeSchema)
