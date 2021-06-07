// Last Updated: 07/06/2021 01:05:14 a. m.
// Updated By  : Luis Danilo Ruiz Tórrez
'use strict'

const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
const SettingsSchema = Schema({
  "company": {
    "type": Schema.Types.ObjectId,
    ref: "Company",
    required: [true, "ES REQUERIDO"],
  },
  "packageTare": {
    "type": "Number",
    required: [true, "ES REQUERIDO"],
  },
  "bigBagTare": {
    "type": "Number",
    required: [true, "ES REQUERIDO"],
  },
  "processingUM": {
    "type": "String",
    required: [true, "ES REQUERIDO"],
  },
  "salesUM": {
    "type": "String",
    required: [true, "ES REQUERIDO"],
  },
  "processBatchSize": {
    "type": "Number",
    required: [true, "ES REQUERIDO"],
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
 *     Settings:
 *       required: 
 *         - "company"
 *         - "packageTare"
 *         - "bigBagTare"
 *         - "processingUM"
 *         - "salesUM"
 *         - "processBatchSize"
 *         - "isActive"
 *       properties: 
 *         company: 
 *           type: "string"
 *           format: "oid"
 *           example: "123456123456123456123456"
 *         packageTare: 
 *           type: "number"
 *           example: 0.05
 *         bigBagTare: 
 *           type: "number"
 *           example: 2.2
 *         processingUM: 
 *           type: "string"
 *           example: "QQ"
 *         salesUM: 
 *           type: "string"
 *           example: "KG"
 *         processBatchSize: 
 *           type: "number"
 *           example: 650
 *         isActive: 
 *           type: "boolean"
 *           example: true

 */

module.exports = mongoose.model('Settings',SettingsSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.

