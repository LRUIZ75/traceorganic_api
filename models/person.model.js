'use strict'

const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

const PersonSchema = Schema({
    names:
      {
      type: String,
      minLength: 2,
      required: [true, 'campo requerido'] 
      },
    surnames:
      {
        type: String,
        minLength: 2,
        required: [true, 'campo requerido'] 
      },
    
    identNumber:
      { type: String },
    identType:
      { type: String,
        enum: ['Pasaporte', 'Cédula', 'Residencia', 'Licencia Conductor'] },
    genre:
      { type: String,
        enum: ['Hombre', 'Mujer', 'No binario', ''],
        default: '' },
    birthdate:
      { type: Date },
    picture:
      { type: String }
    
});


PersonSchema.virtual('fullName').get(function () {
  return this.names + ' ' + this.surnames;
});


//ToDo: Modify this!!!
/**
 * @swagger
 * components:
 *   schemas:
 *     Person:
 *       properties: 
 *         names:
 *           type: "string"
 *           example: "Emilio"
 *         surnames:
 *           type: "string"
 *           example: "Morales"
 *         identNumber:
 *           type: "string"
 *           example: "213-120545-0242S"
 *         identType:
 *           type: "string"
 *           example: "Cédula"   
 *         genre:
 *           type: "string"
 *           example: "Hombre"
 *         birthdate:
 *           type: "string"
 *           format: "date"
 *         picture:
 *           type: "string"
 *       required:
 *         - names
 *         - surnames
 */

module.exports = mongoose.model('Person',PersonSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.

