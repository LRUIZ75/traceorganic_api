"use strict";

const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;

const VehicleSchema = Schema({
  plateNumber: {
    type: String,
    index: { unique: true },
    minLength: 6,
    required: [true, "ES REQUERIDO"],
  },
  vehicleType: {
    type: String,
    enum: ["TRUCK", "PICKUP-TRUCK", "WAGGON", "OTHER"],
    required: [true, "ES REQUERIDO"],
  },
  picture: { type: String },
  maxCapacityKg: { type: Number },
  presetTareKg: { type: Number },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "Person",
  },
});

//ToDo: Modify this!!!
/**
 * @swagger
 * components:
 *   schemas:
 *     Vehicle:
 *       properties:
 *         plateNumber:
 *           type: "string"
 *         vehicleType:
 *           type: "string"
 *           enum: ["TRUCK", "PICKUP-TRUCK", "WAGGON", "OTHER"]
 *           example: "TRUCK"
 *         picture:
 *           type: "string"
 *         maxCapacityKg:
 *           type: "number"
 *         presetTareKg:
 *           type: "number"
 *         owner:
 *           type: "string"
 *           format: "oid"
 *       required:
 *         - plateNumber
 *         - vehicleType
 *
 */

module.exports = mongoose.model("Vehicle", VehicleSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.
