﻿// Last Updated: 07/06/2021 10:36:26 p. m.
// Updated By  : Luis Danilo Ruiz Tórrez
'use strict'

const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
const FarmerSchema = Schema({
  "name": {
    "type": "String",
    index: { unique: true },
    trim: true,
    required: [true, "ES REQUERIDO"],
  },
  "description": {
    "type": "String",
    trim: true,
    required: [true, "ES REQUERIDO"],
  },
  "owner": {
    "type": Schema.Types.ObjectId,
    ref: "Person"
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
  "googlemap": {
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
FarmerSchema.pre("update", updateValidation);
FarmerSchema.pre("updateOne", updateValidation);
FarmerSchema.pre("findOneAndUpdate", updateValidation); // incluye findByIdAndUpdate



//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
/**
 * @swagger
 * components:
 *   schemas:
 *     Farmer:
 *       required: 
 *         - "name"
 *         - "description"
 *       properties: 
 *         name: 
 *           type: "string"
 *           example: "Jhon the Farmer"
 *         description: 
 *           type: "string"
 *           example: "Finca Jhon Farmer"
 *         owner: 
 *           $ref: "#/components/schemas/Location"
 *         googlemap: 
 *           type: "string"
 *           example: "url google maps"
 */

module.exports = mongoose.model('Farmer',FarmerSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.

