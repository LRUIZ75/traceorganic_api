'use strict'

const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

const VehicleSchema = Schema({
    plateNumber:
      { 
        type: String,
        minLength: 6,
        required: [true,'el campo es requerido']
      },
    vehicleType:
      { type: String,
        enum: ['Camión', 'Camioneta', 'Furgón', 'Rastra', 'Otro'],
        required: [true,'el campo es requerido']
      },
    picture:
      { type: String,
      },
    maxCapacityKg:
      { type: Number },
    presetTareKg:
      { type: Number },
    defaultDriverId:
      { type: mongoose.ObjectId}
    
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
 *         picture:
 *           type: "string"
 *         maxCapacityKg:
 *           type: "number"
 *         presetTareKg:
 *           type: "number"
 *         defaultDriverId:
 *           type: "string"
 *       required:
 *         - plateNumber
 *         - vehicleType
 *
 */

module.exports = mongoose.model('Vehicle',VehicleSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.

