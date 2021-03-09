'use strict'

const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

const DriverSchema = Schema({
    personId:
      { 
        type: mongoose.ObjectId,
        required: [true, "el campo es requerido"]
      },
    registerDate:
      { type: Date },
    isActive:
      { type: Boolean }
    
});

//ToDo: Modify this!!!
/**
 * @swagger
 * components:
 *   schemas:
 *     Driver:
 *       properties: 
 *         personId:
 *           type: "string"
 *         registerDate:
 *           type: "string"
 *           format: "date-time"
 *         isActive:
 *           type: "boolean"
 *       required:
 *         - personId
 *
 */

module.exports = mongoose.model('Driver',DriverSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.

