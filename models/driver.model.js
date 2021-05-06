"use strict";

const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;

const DriverSchema = Schema({
  person: {
    type: Schema.Types.ObjectId,
    ref: "Person",
    required: [true, "ES REQUERIDO"],
  },
  creationDate: { type: Date, default: Date.now },
  licenseCard: {
    type: String,
    trim: true,
    minlength: 5,
    unique: true,
    index: true,
    required: [true, "ES REQUERIDO"],
  },
  insuranceCard: {
    type: String,
    trim: true,
    default: null
  },
  isActive: { type: Boolean, default: true },
});

//ToDo: Modify this!!!
/**
 * @swagger
 * components:
 *   schemas:
 *     Driver:
 *       properties:
 *         person:
 *           type: "string"
 *           format: "oid"
 *         creationDate:
 *           type: "string"
 *           format: "date"
 *         licenseCard:
 *           type: string
 *         insuranceCard:
 *           type: string
 *           default: null
 *         isActive:
 *           type: "boolean"
 *           default: true
 *       required:
 *         - person
 *         - licenseCard
 *
 */

module.exports = mongoose.model("Driver", DriverSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.
