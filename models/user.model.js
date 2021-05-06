'use strict'

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcryptjs");


const Schema = mongoose.Schema;



const UserSchema = Schema({

	username: {
        type: String,
        required: [true, "ES REQUERIDO"],
        unique: true,
        index: true,
        minLength: 4,
        maxLength: 20,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        trim: true,
        minLength: 8,
        required: [true, "ES REQUERIDO"],
        set: v=> {
            var salt=bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(v, salt);
            return hash;
        }
    },
	person: {
        type: Schema.Types.ObjectId, 
        ref: 'Person',
        required: [true, "ES REQUERIDO"]
    },
	email: {
        type: String, 
        trim: true, 
        lowercase: true, 
        unique: true, 
        index: true,
        required: [true, "ES REQUERIDO"],
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} no es una dirección de correo válida',
            isAsync: false
        }
    }, 
	isVerifiedEmail: {
        type: Boolean,
        default: false
    },
	creationDate: {
        type: Date,
        default: Date.now()},
	roles: {
        type: Array(Schema.Types.ObjectId),
        ref: 'role'
    },
	company: {  
        type: Schema.Types.ObjectId,
        ref: 'company',
        required: [true, "ES REQUERIDO"]
    },
	refreshAccessToken: {
        type: String,
        default: null
    },
	isActive: {
        type: Boolean,
        default: false
    },
	
});

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       properties: 
 *         username:
 *           type: "string"
 *         password:
 *           type: "string"
 *           format: "password"
 *         person: 
 *           type: "string"
 *           format: "oid"
 *         email:
 *           type: "string"
 *           format: "email"
 *         isVerifiedEmail:
 *           type: "boolean"
 *           default: "false"
 *         creationDate:
 *           type: "string"
 *           format: "date"
 *         roles:
 *            type: "array"
 *            items:
 *              type: "string"
 *              format: oid
 *         company:
 *           type: "string"
 *           format: "oid"
 *         refreshAccessToken:
 *           type: "string"
 *         isActive:
 *           type: "boolean"
 *           default: false
 *       required:
 *         - username
 *         - password
 *         - personId
 *         - email
 *         - company
 *
 */

module.exports = mongoose.model('User',UserSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.