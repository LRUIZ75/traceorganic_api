// Last Updated: 07/06/2021 11:47:02 p. m.
// Updated By  : Luis Danilo Ruiz Tórrez
'use strict'

const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
const ProductSchema = Schema({
  "company": {
    "type": Schema.Types.ObjectId,
    ref: "Company",
    required: [true, "ES REQUERIDO"],
  },
  "name": {
    "type": "String",
    required: [true, "ES REQUERIDO"],
  },
  "quality": {
    "type": "String"
  },
  "description": {
    "type": "String"
  },
  "isSubproduct": {
    "type": "Boolean",
    required: [true, "ES REQUERIDO"],
    default:"false"
  },
  "isMarketable": {
    "type": "Boolean",
    required: [true, "ES REQUERIDO"],
    default: "false"
  },
  "maxImpurity": {
    "type": "Number",
    required: [true, "ES REQUERIDO"],
    default: 0.03
  },
  "maxHumidity": {
    "type": "Number",
    required: [true, "ES REQUERIDO"],
    default: 0.07
  },
  "maxCull": {
    "type": "Number",
    required: [true, "ES REQUERIDO"],
    default:0
  },
  "maxSand": {
    "type": "Number",
    required: [true, "ES REQUERIDO"],
    default: 0
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
 *     Product:
 *       required: 
 *         - "company"
 *         - "name"
 *         - "isSubproduct"
 *         - "isMarketable"
 *         - "maxImpurity"
 *         - "maxHumidity"
 *         - "maxCull"
 *         - "maxSand"
 *       properties: 
 *         company: 
 *           type: "string"
 *           format: "oid"
 *           example: "123456123456123456123456"
 *         name: 
 *           type: "string"
 *           example: "ARROZ NATURAL"
 *         quality: 
 *           type: "string"
 *           example: "INDETERMINADO"
 *         description: 
 *           type: "string"
 *           example: "ARROZ GRANZA NATURAL"
 *         isSubproduct: 
 *           type: "boolean"
 *           example: true
 *         isMarketable: 
 *           type: "boolean"
 *           example: false
 *         maxImpurity: 
 *           type: "number"
 *           example: 0.03
 *         maxHumidity: 
 *           type: "number"
 *           example: 0.07
 *         maxCull: 
 *           type: "number"
 *           example: 0
 *         maxSand: 
 *           type: "number"
 *           example: 0
 *         picture: 
 *           type: "string"
 *           example: "rice.png"
 */

module.exports = mongoose.model('Product',ProductSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.

