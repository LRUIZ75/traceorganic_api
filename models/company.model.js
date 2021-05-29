"use strict";

const mongoose = require("mongoose");
const validator = require("validator");
//const location = require('./location.model');

const Schema = mongoose.Schema;

//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
const CompanySchema = Schema({
  fullName: {
    type: String,
    index: { unique: true },
    trim: true,
    required: [true, "ES REQUERIDO"],
  },
  shortName: {
    type: String,
    required: [true, "ES REQUERIDO"],
  },
  isActive: {
    type: Boolean,
    default: true,
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
  taxPayerCode: { type: String },
  countryISOCode: {
    type: String,
    default: "NIC",
  },
  logo: { type: String },
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
CompanySchema.pre("update", updateValidation);
CompanySchema.pre("updateOne", updateValidation);
CompanySchema.pre("findOneAndUpdate", updateValidation); // incluye findByIdAndUpdate

//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!

//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       properties:
 *         fullName:
 *           type: "string"
 *           minLength: 2
 *         shortName:
 *           type: "string"
 *         isActive:
 *           type: "boolean"
 *           default: true
 *         location:
 *           $ref: "#/components/schemas/Location"
 *         taxPayerCode:
 *           type: "string"
 *         countryISOCode:
 *           type: "string"
 *           example: "NIC"
 *         logo:
 *           type: "string"
 *       required:
 *         - fullName
 *         - shortName
 */

module.exports = mongoose.model("Company", CompanySchema);
// mongoDB creará la collección, con documentos de estructura del modelo.
