// Last Updated: 08/06/2021 12:15:44 a. m.
// Updated By  : Luis Danilo Ruiz Tórrez
'use strict'

const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
const CertifierSchema = Schema({
  "name": {
    "type": "String",
    trim: true,
    required: [true, "ES REQUERIDO"],
  },
  "company": {
    "type": Schema.Types.ObjectId,
    ref: "Company",
    required: [true, "ES REQUERIDO"],
  },
  "description": {
    "type": "String"
  },
  "logo": {
    "type": "String"
  },
  "web": {
    "type": "String"
  },
  "email": {
    "type": "String"
  }
});

//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
/**
 * @swagger
 * components:
 *   schemas:
 *     Certifier:
 *       required: 
 *         - "name"
 *         - "company"
 *       properties: 
 *         name: 
 *           type: "string"
 *           example: "OrgCertifier"
 *         company: 
 *           type: "string"
 *           format: "oid"
 *           example: "123456123456123456123456"
 *         description: 
 *           type: "string"
 *           example: "Certificador Orgánico"
 *         logo: 
 *           type: "string"
 *           example: "certorg.jpg"
 *         web: 
 *           type: "string"
 *           example: "url web site"
 *         email: 
 *           type: "string"
 *           example: "no-one@nowhere.com"

 */

module.exports = mongoose.model('Certifier',CertifierSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.

