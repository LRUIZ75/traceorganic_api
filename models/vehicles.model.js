// Last Updated: 07/06/2021 02:02:27 a. m.
// Updated By  : Luis Danilo Ruiz Tórrez
'use strict'

const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
const VehiclesSchema = Schema({
  "plateNumber": {
    "type": "String",
    index: { unique: true },
    minLength: 6,
    required: [true, "ES REQUERIDO"],
  },
  "company": {
    "type": Schema.Types.ObjectId,
    ref: "Company",
    required: [true, "ES REQUERIDO"],
  },
  "type": {
    "type": "String",
    enum: ["TRUCK", "PICKUP-TRUCK", "WAGGON", "OTHER"],
    required: [true, "ES REQUERIDO"],
  },
  "brand": {
    "type": "String",
    required: [true, "ES REQUERIDO"],
  },
  "model": {
    "type": "String",
    required: [true, "ES REQUERIDO"],
  },
  "year": {
    "type": "Number",
    required: [true, "ES REQUERIDO"],
  },
  "owner": {
    "type": Schema.Types.ObjectId,
    ref: "Person"
  },
  "registration": {
    "type": "String"
  },
  "insurance": {
    "type": "String"
  },
  "picture": {
    "type": "String"
  },
  "maxCapacity": {
    "type": "Number"
  },
  "avgVehicleTare": {
    "type": "Number"
  },
  "isActive": {
    "type": "Boolean",
    required: [true, "ES REQUERIDO"],
  }
});

//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
/**
 * @swagger
 * components:
 *   schemas:
 *     Vehicles:
 *       required: 
 *         - "plateNumber"
 *         - "company"
 *         - "type"
 *         - "brand"
 *         - "model"
 *         - "year"
 *         - "isActive"
 *       properties: 
 *         plateNumber: 
 *           type: "string"
 *           example: "M54575"
 *         company: 
 *           type: "string"
 *           format: "oid"
 *           example: "123456123456123456123456"
 *         type: 
 *           type: "string"
 *           enum: ["TRUCK", "PICKUP-TRUCK", "WAGGON", "OTHER"]
 *           example: "TRUCK"
 *         brand: 
 *           type: "string"
 *           example: "GMC"
 *         model: 
 *           type: "string"
 *           example: "INTERNATIONAL"
 *         year: 
 *           type: "number"
 *           example: 1995
 *         owner: 
 *           type: "string"
 *           format: "oid"
 *           example: "123456123456123456123456"
 *         registration: 
 *           type: "string"
 *           example: "25545555-545"
 *         insurance: 
 *           type: "string"
 *           example: "insurance.png"
 *         picture: 
 *           type: "string"
 *           example: "mytruck.jpg"
 *         maxCapacity: 
 *           type: "number"
 *           example: 3000
 *         avgVehicleTare: 
 *           type: "number"
 *           example: 3000
 *         isActive: 
 *           type: "boolean"
 *           example: true

 */

module.exports = mongoose.model('Vehicles',VehiclesSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.

