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
  picture: { type: String },
  googlemap: { type: String },
  packageTare: {
    type: "Number",
    required: [true, "ES REQUERIDO"],
  },
  bigBagTare: {
    type: "Number",
    required: [true, "ES REQUERIDO"],
  },
  processingUM: {
    type: "String",
    required: [true, "ES REQUERIDO"],
  },
  salesUM: {
    type: "String",
    required: [true, "ES REQUERIDO"],
  },
  processBatchSize: {
    type: "Number",
    required: [true, "ES REQUERIDO"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
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
/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       properties:
 *         fullName:
 *           type: "string"
 *           minLength: 2
 *           example: "Cooperativa XYZ"
 *         shortName:
 *           type: "string"
 *           example: "COOPRXYZ"
 *         location:
 *           $ref: "#/components/schemas/Location"
 *         taxPayerCode:
 *           type: "string"
 *           example: "23423423"
 *         countryISOCode:
 *           type: "string"
 *           example: "NIC"
 *         logo:
 *           type: "string"
 *           example: "logcCoop.png"
 *         picture:
 *           type: "string"
 *           example: "building.jpg"
 *         googlemap:
 *           type: "string"
 *           example: "url to google map"
 *         packageTare:
 *           type: "number"
 *           example: 0.05
 *         bigBagTare:
 *           type: "number"
 *           example: 2.2
 *         processingUM:
 *           type: "string"
 *           example: "QQ"
 *         salesUM:
 *           type: "string"
 *           example: "KG"
 *         processBatchSize:
 *           type: "number"
 *           example: 650
 *         isActive:
 *           type: "boolean"
 *           example: true
 *       required:
 *         - fullName
 *         - shortName
 *         - "packageTare"
 *         - "bigBagTare"
 *         - "processingUM"
 *         - "salesUM"
 *         - "processBatchSize"
 *         - "isActive"
 *         - location
 */

module.exports = mongoose.model("Company", CompanySchema);
// mongoDB creará la collección, con documentos de estructura del modelo.
