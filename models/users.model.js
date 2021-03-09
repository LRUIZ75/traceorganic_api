'use strict'

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcryptjs");


const Schema = mongoose.Schema;



const UserSchema = Schema({

	userName: {
        type: String,
        required: [true,'Nombre de usuario requrido'],
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
        required: [true, 'La contraseña es requerida'],
        set: v=> {
            var salt=bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(v, salt);
            return hash;
        }
    },
	personId: {
        type: mongoose.ObjectId,
       //required: [true, "Datos de persona requeridos"]
    },
	registeredEmail: {
        type: String, 
        trim: true, 
        lowercase: true, 
        unique: true, 
        required:[true, 'El correo es requrido'],
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} no es una dirección de correo válida',
            isAsync: false
        }
    }, 
	isVerifiedEmail: Boolean,
	ssoProviderId: mongoose.ObjectId,

	registrationDate: {
        type: Date,
        default: Date.now()},
	pinOTP: String,
	pinOTPExpiration: Date,
	profilesNames: Array(String),
	clientId: mongoose.ObjectId,
	refreshAccessToken: String,
	isLoggedOn: Boolean,
	lastLogOn: Date,
	isActive: Boolean,
	
});



module.exports = mongoose.model('User',UserSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.