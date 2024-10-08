﻿// Last Updated: 07/06/2021 08:53:39 p. m.
// Updated By  : Luis Danilo Ruiz Tórrez
'use strict'

const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
const ProviderSchema = Schema({
  "name": {
    "type": "String",
    trim: true,
    required: [true, "ES REQUERIDO"],
  },
  "shortName": {
    "type": "String",
    trim: true,
    required: [true, "ES REQUERIDO"],
  },
  "company": {
    "type": Schema.Types.ObjectId,
    ref: "Company"
  },
  "farmers": {
    "type": [
      Schema.Types.ObjectId
    ],
    ref: "Farmer"
  },
  "taxPayerCode": {
    "type": "String"
  },
  location: {
    lat: {
      type: Number,
      default: 0,
      validate: {
        validator: function (v) {
          return isFinite(v) && Math.abs(v) <= 90;
        },
        message: "NO VÁLIDO",
      },
    },
    lng: {
      type: Number,
      default: 0,
      validate: {
        validator: function (v) {
          return isFinite(v) && Math.abs(v) <= 180;
        },
        message: "NO VÁLIDO",
      },
    },
  },
  "website": {
    "type": "String"
  },
  "email": {
    "type": "String"
  },
  "phone": {
    "type": "String"
  },
  "contactPerson": {
    "type": Schema.Types.ObjectId,
    ref: "Person"
  },
  "googlemap": {
    "type": "String"
  },
  "picture": {
    "type": "String"
  }
});

// La función de validación para actualizacion:
const updateValidation = function (next) {
  let update = this.getUpdate();
  if (Object.entries(update).length) {
    if (update.$set) {
      if (update.$set.location) {
        if (update.$set.location.lat) {
          if (!update.$set.location.lng)
            return next(new Error("location lng missing value"));
          if (
            !(
              isFinite(update.$set.location.lat) &&
              Math.abs(update.$set.location.lat) <= 90
            )
          )
            return next(new Error("location lat invalid values"));
        }
        if (update.$set.location.lng) {
          if (!update.$set.location.lat)
            return next(new Error("location lat missing value"));
          if (
            !(
              isFinite(update.$set.location.lng) &&
              Math.abs(update.$set.location.lng) <= 180
            )
          )
            return next(new Error("location lng invalid values"));
        }
      }
    }
  }
  return next();
};

// la declaración de middleware:
ProviderSchema.pre("update", updateValidation);
ProviderSchema.pre("updateOne", updateValidation);
ProviderSchema.pre("findOneAndUpdate", updateValidation); // incluye findByIdAndUpdate


//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
/**
 * @swagger
 * components:
 *   schemas:
 *     Provider:
 *       required: 
 *         - "name"
 *         - "shortName"
 *         - "company"
 *         - "farmers"
 *       properties: 
 *         name: 
 *           type: "string"
 *           example: "Asociación XYZ"
 *         shortName: 
 *           type: "string"
 *           example: "ASOXYZ"
 *         company: 
 *           type: "string"
 *           format: "oid"
 *           example: "123456123456123456123456"
 *         farmers: 
 *           type: "array"
 *           items: 
 *             type: "string"
 *             format: "oid"
 *           example: 
 *             - "123123123123123123123123"
 *             - "123123123123123123123122"
 *         taxPayerCode: 
 *           type: "string"
 *           example: "24232"
 *         location: 
 *           required: 
 *             - "lat"
 *             - "lng"
 *           properties: 
 *             lat: 
 *               type: "number"
 *               example: 0
 *             lng: 
 *               type: "number"
 *               example: 0
 *           type: "object"
 *         website: 
 *           type: "string"
 *           example: "url website"
 *         email: 
 *           type: "string"
 *           example: "none@nowhere.com"
 *         phone: 
 *           type: "string"
 *           example: "85584655"
 *         contactPerson: 
 *           type: "string"
 *           format: "oid"
 *           example: "123456123456123456123456"
 *         googlemap: 
 *           type: "string"
 *           example: "url google map"
 *         picture: 
 *           type: "string"
 *           example: "provider xyz.png"

 */

module.exports = mongoose.model('Provider',ProviderSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.

