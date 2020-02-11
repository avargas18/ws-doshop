'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
    name: { type: String },
    create_by: { type: Object },
    create_at: { type: Date },
    modified_by: { type: Object },
    modified_at: { type: Date },
    inactive: { type: Boolean, default: false }
})

const storeSchema = new Schema({
    name: { type: String },
    create_by: { type: Object },
    create_at: { type: Date },
    modified_by: { type: Object },
    modified_at: { type: Date },
    inactive: { type: Boolean, default: false }
})

const productSchema = new Schema({
    name: { type: String },
    category: categorySchema,
    store: storeSchema,
    stock: { type: Number },
    price: { type: Number },
    images: { type: Array },
    description: { type: String, required: false },
    tags: { type: Array },
    create_by: { type: Object },
    create_at: { type: Date },
    modified_by: { type: Object },
    modified_at: { type: Date },
    inactive: { type: Boolean, default: false }
})

module.exports = mongoose.model('Product', productSchema)
