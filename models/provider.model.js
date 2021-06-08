// Last Updated: 07/06/2021 08:53:39 p. m.
// Updated By  : Luis Danilo Ruiz Tórrez
'use strict'

const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
const ProviderSchema = Schema({
  "name": {
    "type": "String",
    trim: true,
    required: [true, "ES REQUERIDO"],
  },
  "shortName": {
    "type": "String",
    trim: true,
    required: [true, "ES REQUERIDO"],
  },
  "company": {
    "type": Schema.Types.ObjectId,
    ref: "Company"
  },
  "farmers": {
    "type": [
      Schema.Types.ObjectId
    ]
  },
  "taxPayerCode": {
    "type": "String"
  },
  "location": {
    "lat": {
      "type": "Number"
    },
    "lng": {
      "type": "Number"
    }
  },
  "website": {
    "type": "String"
  },
  "email": {
    "type": "String"
  },
  "phone": {
    "type": "String"
  },
  "contactPerson": {
    "type": Schema.Types.ObjectId,
    ref: "Person"
  },
  "googlemap": {
    "type": "String"
  },
  "picture": {
    "type": "String"
  }
});

//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
/**
 * @swagger
 * components:
 *   schemas:
 *     Provider:
 *       required: 
 *         - "name"
 *         - "shortName"
 *         - "company"
 *         - "farmers"
 *       properties: 
 *         name: 
 *           type: "string"
 *           example: "Asociación XYZ"
 *         shortName: 
 *           type: "string"
 *           example: "ASOXYZ"
 *         company: 
 *           type: "string"
 *           format: "oid"
 *           example: "123456123456123456123456"
 *         farmers: 
 *           type: "array"
 *           items: 
 *             type: "string"
 *             format: "oid"
 *           example: 
 *             - "123123123123123123123123"
 *             - "123123123123123123123122"
 *         taxPayerCode: 
 *           type: "string"
 *           example: "24232"
 *         location: 
 *           required: 
 *             - "lat"
 *             - "lng"
 *           properties: 
 *             lat: 
 *               type: "number"
 *               example: 0
 *             lng: 
 *               type: "number"
 *               example: 0
 *           type: "object"
 *         website: 
 *           type: "string"
 *           example: "url website"
 *         email: 
 *           type: "string"
 *           example: "none@nowhere.com"
 *         phone: 
 *           type: "string"
 *           example: "85584655"
 *         contactPerson: 
 *           type: "string"
 *           format: "oid"
 *           example: "123456123456123456123456"
 *         googlemap: 
 *           type: "string"
 *           example: "url google map"
 *         picture: 
 *           type: "string"
 *           example: "provider xyz.png"

 */

module.exports = mongoose.model('Provider',ProviderSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.

