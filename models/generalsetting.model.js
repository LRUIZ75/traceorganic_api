'use strict'

const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

const GeneralSettingSchema = Schema({
    companyName:
      { 
        type: String,
        required:[true, 'campo requerido'] },
    taxPayerCode:
      { type: String },
    countryISOCode:
      { 
        type: String,
        default: "NIC" 
      },
    logo:
      { type: String }
    
});

//ToDo: Modify this!!!
/**
 * @swagger
 * components:
 *   schemas:
 *     GeneralSetting:
 *       properties: 
 *         companyName:
 *           type: "string"
 *           required: "true"
 *         taxPayerCode:
 *           type: "string"
 *         countryISOCode:
 *           type: "string"
 *           example: "NIC"
 *         logo:
 *           type: "string"
 *
 */

module.exports = mongoose.model('GeneralSetting',GeneralSettingSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.

