// Last Updated: 07/06/2021 02:32:59 a. m.
// Updated By  : Luis Danilo Ruiz Tórrez
"use strict";

const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;

//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
const WarehouseSchema = Schema({
  name: {
    type: "String",
    trim: true,
    required: [true, "ES REQUERIDO"],
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: [true, "ES REQUERIDO"],
  },
  processingCenter: {
    type: Schema.Types.ObjectId,
    ref: "ProcessingCenter",
    required: [true, "ES REQUERIDO"],
  },
  description: {
    type: "String",
  },
  storageCapacity: {
    type: "Number",
    required: [true, "ES REQUERIDO"],
  },
  isVirtual: {
    type: "Boolean",
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
  picture: {
    type: "String",
  },
  isActive: {
    type: "Boolean",
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
WarehouseSchema.pre("update", updateValidation);
WarehouseSchema.pre("updateOne", updateValidation);
WarehouseSchema.pre("findOneAndUpdate", updateValidation); // incluye findByIdAndUpdate

//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
/**
 * @swagger
 * components:
 *   schemas:
 *     Warehouse:
 *       required: 
 *         - "name"
 *         - "company"
 *         - "processingCenter"
 *         - "storageCapacity"
 *       properties: 
 *         name: 
 *           type: "string"
 *           example: "Warehouse name"
 *         company: 
 *           type: "string"
 *           format: "oid"
 *           example: "123456123456123456123456"
 *         processingCenter: 
 *           type: "string"
 *           format: "oid"
 *           example: "123456123456123456123456"
 *         description: 
 *           type: "string"
 *           example: "Not needed"
 *         storageCapacity: 
 *           type: "number"
 *           example: 100
 *         isVirtual: 
 *           type: "boolean"
 *           example: false
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
 *         picture: 
 *           type: "string"
 *           example: "some.jpeg"
 *         isActive: 
 *           type: "boolean"
 *           example: true
 */

module.exports = mongoose.model("Warehouse", WarehouseSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.
