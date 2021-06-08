// Last Updated: 05/05/2021 12:47:00 a. m.
// Updated By  : LRUIZ
"use strict";

const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;

//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
const PersonSchema = Schema({
  names: {
    type: String,
    trim: true,
    minlength: 1,
    required: [true, "ES REQUERIDO"],
  },
  lastNames: {
    type: String,
    trim: true,
    minlength: 1,
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
    description: "Tipo de Identificación de Ciudadano"
  },
  idNumber: {
    type: String,
    unique: true,
    uppercase: true,
    minlength: 5,
    trim: true,
    required: [true, "ES REQUERIDO"],
    description: "Identificación de Ciudadano"
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

//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
/**
 * @swagger
 * components:
 *   schemas:
 *     Person:
 *       properties:
 *         names:
 *           type: "string"
 *           example: "Juan"
 *         lastNames:
 *           type: "string"
 *           example: "Pérez"
 *         idType:
 *           type: "string"
 *           enum: ["ID-CARD", "PASSPORT", "RESIDENCE", "DRIVER"]
 *           example: "ID-CARD"
 *         idNumber:
 *           type: "string"
 *           example: "001-220377-0020S"
 *         genre:
 *           type: "string"
 *           enum: ["M", "F", "U"]
 *           example: "M"
 *         mobile:
 *           type: string
 *           format: phone
 *           example: "77485574"
 *         birthDate:
 *           type: "string"
 *           format: "date"
 *           example: "19770322"
 *         picture:
 *           type: "string"
 *           example: "handsome.jpeg"
 *         isUser: 
 *           type: "boolean"
 *           example: "false"
 *         isDriver: 
 *           type: "boolean"
 *           example: "false" 
 *       required:
 *         - names
 *         - lastNames
 *         - idType
 *         - idNumber
 *         - genre
 *         - mobile
 *         - birthDate
 */


module.exports = mongoose.model("Person", PersonSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.
