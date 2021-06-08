// Last Updated: 08/06/2021 12:56:40 a. m.
// Updated By  : Luis Danilo Ruiz Tórrez
'use strict'

const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
const CertificateSchema = Schema({
  "number": {
    "type": "String",
    index: { unique: true },
    trim: true,
    required: [true, "ES REQUERIDO"],
  },
  "productName": {
    "type": "String",
    trim: true,
    required: [true, "ES REQUERIDO"],
  },
  "description": {
    "type": "String",
    trim: true,
    required: [true, "ES REQUERIDO"],
  },
  "certifier": {
    "type": Schema.Types.ObjectId,
    ref: "Certifier"
  },
  "issuedTo": {
    "type": "String",
    trim: true,
    required: [true, "ES REQUERIDO"],
  },
  "dateSince": {
    "type": "Date",
    required: [true, "ES REQUERIDO"],
  },
  "dateFrom": {
    "type": "Date",
    required: [true, "ES REQUERIDO"],
  },
  "dateUntil": {
    "type": "Date",
    required: [true, "ES REQUERIDO"],
  },
  "file": {
    "type": "String"
  },
  "isCropsProduction": {
    "type": "Boolean",
    default: false
  },
  "isHandlingProcessing": {
    "type": "Boolean",
    default: false
  },
  "isMarketing": {
    "type": "Boolean",
    default: false
  },
  "isMaster": {
    "type": "Boolean",
    default: false
  },
  "master": {
    "type": "ObjectId"
  },
  "isActive": {
    "type": "Boolean",
    default: true
  }
});

//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
/**
 * @swagger
 * components:
 *   schemas:
 *     Certificate:
 *       required: 
 *         - "number"
 *         - "productName"
 *         - "description"
 *         - "certifier"
 *         - "issuedTo"
 *         - "dateSince"
 *         - "dateFrom"
 *         - "dateUntil"
 *       properties: 
 *         number: 
 *           type: "string"
 *           example: "23321"
 *         productName: 
 *           type: "string"
 *           example: "ARROZ ORGANICO ORO"
 *         description: 
 *           type: "string"
 *           example: "CERTIFICADO ORGCERT PRODUCTOR ORGÁNICO"
 *         certifier: 
 *           type: "string"
 *           format: "oid"
 *           example: "543123543123543123543123"
 *         issuedTo: 
 *           type: "string"
 *           example: "BIO PRODUCTOS"
 *         dateSince: 
 *           type: "string"
 *           example: "2016-01-01T00:00:00.000Z"
 *         dateFrom: 
 *           type: "string"
 *           example: "2020-01-01T00:00:00.000Z"
 *         dateUntil: 
 *           type: "string"
 *           example: "2021-01-01T00:00:00.000Z"
 *         file: 
 *           type: "string"
 *           example: "certificate.png"
 *         isCropsProduction: 
 *           type: "boolean"
 *           example: true
 *         isHandlingProcessing: 
 *           type: "boolean"
 *           example: false
 *         isMarketing: 
 *           type: "boolean"
 *           example: false
 *         isMaster: 
 *           type: "boolean"
 *           example: false
 *         master: 
 *           type: "string"
 *           format: "oid"
 *           example: "123456123456123456123456"
 *         isActive: 
 *           type: "boolean"
 *           example: true

 */

module.exports = mongoose.model('Certificate',CertificateSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.

