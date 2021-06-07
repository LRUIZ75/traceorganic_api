// Last Updated: 07/06/2021 02:42:00 a. m.
// Updated By  : Luis Danilo Ruiz Tórrez
'use strict'

const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
const ProcessingCenterSchema = Schema({
  "name": {
    "type": "String",
    index: { unique: true },
    trim: true,
    required: [true, "ES REQUERIDO"],
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
  "company": {
    "type": Schema.Types.ObjectId,
    ref: "Company",
    required: [true, "ES REQUERIDO"],
  },
  "picture": {
    "type": "String"
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
ProcessingCenterSchema.pre("update", updateValidation);
ProcessingCenterSchema.pre("updateOne", updateValidation);
ProcessingCenterSchema.pre("findOneAndUpdate", updateValidation); // incluye findByIdAndUpdate

//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
/**
 * @swagger
 * components:
 *   schemas:
 *     ProcessingCenter:
 *       required: 
 *         - "name"
 *         - "location"
 *         - "company"
 *       properties: 
 *         name: 
 *           type: "string"
 *           example: "Processing Center"
 *         location: 
 *           $ref: "#/components/schemas/Location"
 *         company: 
 *           type: "string"
 *           format:  "oid"
 *           example: "123456123456123456123456"
 *         picture: 
 *           type: "string"
 *           example: "some.png"
 *         googlemap: 
 *           type: "string"
 *           example: "http://map.google.com/xyz"

 */

module.exports = mongoose.model('ProcessingCenter',ProcessingCenterSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.

