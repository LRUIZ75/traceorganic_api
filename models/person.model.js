// Last Updated: 05/05/2021 12:47:00 a. m.
// Updated By  : LRUIZ
"use strict";

const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;

//ToDo: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!//ToDo: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
const PersonSchema = Schema({
  names: {
    type: String,
    trim: true,
    minlength: 2,
    required: [true, "ES REQUERIDO"],
  },
  lastNames: {
    type: String,
    trim: true,
    minlength: 2,
    required: [true, "ES REQUERIDO"],
  },
  idType: {
    type: String,
    enum: [
      "ID-CARD",
      "PASSPORT",
      "RESIDENCE",
      "DRIVER",
    ],
    required: [true, "ES REQUERIDO"],
    description: "Citinzenship ID Type"
  },
  idNumber: {
    type: String,
    unique: true,
    minlength: 5,
    trim: true,
    required: [true, "ES REQUERIDO"],
    description: "Citinzenship ID Number"
  },
  genre: {
    type: String,
    minlength: 1,
    maxlength: 1,
    enum: ["M", "F", "U"],
    required: [true, "ES REQUERIDO"],
  },
  mobile: {
    type: String
  },
  birthDate: {
    type: Date,
  },
  picture: { type: String },
  isUser: {
    type: Boolean,
    default: false
  },
  isDriver: {
    type: Boolean,
    default: false
  }

});

//ToDo: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
/**
 * @swagger
 * components:
 *   schemas:
 *     Person:
 *       properties:
 *         names:
 *           type: "string"
 *         lastNames:
 *           type: "string"
 *         idType:
 *           type: "string"
 *           enum: ["ID-CARD", "PASSPORT", "RESIDENCE", "DRIVER"]
 *           example: "ID-CARD"
 *         idNumber:
 *           type: "string"
 *         genre:
 *           type: "string"
 *           enum: ["M", "F", "U"]
 *           example: "M"
 *         mobile:
 *           type: string
 *           format: phone
 *         birthDate:
 *           type: "string"
 *           format: "date"
 *         picture:
 *           type: "string"
 *           example: ""
 *         isUser: 
 *           type: "boolean"
 *           default: "false"
 *         isDriver: 
 *           type: "boolean"
 *           default: "false" 
 *       required:
 *         - names
 *         - lastNames
 *         - idType
 *         - idNumber
 *         - genre
 * 
 */

module.exports = mongoose.model("Person", PersonSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.
