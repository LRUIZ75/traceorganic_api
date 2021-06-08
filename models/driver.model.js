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
  company: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: [true, "ES REQUERIDO"],
  },
  license: {
    type: String,
    index: {unique: true},
    default: null
 
  },
  insurance: {
    type: String,
    default: null,
  },
  isActive: { type: Boolean, default: true },
});

//TODO: Modify this!!!
/**
 * @swagger
 * components:
 *   schemas:
 *     Driver:
 *       properties:
 *         person:
 *           type: string
 *           format: oid
 *           example: "123456123456123456123456"
 *         company:
 *           type: string
 *           format: "oid"
 *           example: "123456123456123456123456"
 *         licenseCard:
 *           type: string
 *           default: null
 *         insuranceCard:
 *           type: string
 *           default: null
 *         isActive:
 *           type: boolean
 *           example: true
 *       required:
 *         - person
 *         - company
 *         - isActive
 *
 */

module.exports = mongoose.model("Driver", DriverSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.
