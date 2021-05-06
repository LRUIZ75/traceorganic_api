'use strict'

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcryptjs");


const Schema = mongoose.Schema;



const UserSchema = Schema({

	userName: {
        type: String,
        required: [true,'el campo es requerido'],
        unique: true,
        minLength: 4,
        maxLength: 20,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        trim: true,
        minLength: 8,
        required: [true, 'el campo es requerido'],
        set: v=> {
            var salt=bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(v, salt);
            return hash;
        }
    },
	person: {
        type: Schema.Types.ObjectId, 
        ref: 'Person',
        required: [true, "el campo es requerido"]
    },
	email: {
        type: String, 
        trim: true, 
        lowercase: true, 
        unique: true, 
        required:[true, 'el campo es requerido'],
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} no es una dirección de correo válida',
            isAsync: false
        }
    }, 
	isVerifiedEmail: Boolean,
	registrationDate: {
        type: Date,
        default: Date.now()},
	profilesNames: Array(String),
	companyId: mongoose.ObjectId,
	refreshAccessToken: String,
	isActive: Boolean,
	
});

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       properties: 
 *         userName:
 *           type: "string"
 *         password:
 *           type: "string"
 *           format: "password"
 *         person: 
 *           type: "string"
 *           format: "ObjectId"
 *         email:
 *           type: "string"
 *           format: "email"
 *         isVerifiedEmail:
 *           type: "boolean"
 *         profilesNames:
 *            type: "array"
 *            items:
 *              type: "string"
 *         companyId:
 *           type: "string"
 *         refreshAccessToken:
 *           type: "string"
 *         isActive:
 *           type: "boolean"
 *       required:
 *         - userName
 *         - password
 *         - personId
 *         - email
 *
 */

module.exports = mongoose.model('User',UserSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.