'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const validRoles = {
    values: ['ADM', 'USR', 'SELL'],
    message: '{VALUE} no es un rol válido'
}

const userSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es requerido'] },
    email: { type: String, required: [true, 'El correo es requerido'] },
    password: { type: String, required: [true, 'La contraseña es requerida'] },
    img: { type: String, required: false },
    role: { type: String, default: 'USR', enum: validRoles },
    phone: { type: Number },
    birth_date: { type: Date },
    google: { type: Boolean, default: false },
    create_by: { type: Object, default: 'system' },
	create_at: { type: Date },
	modified_by: { type: Object },
	modified_at: { type: Date },
    inactive: { type: Boolean, default: false }
})

module.exports = mongoose.model('User', userSchema)
