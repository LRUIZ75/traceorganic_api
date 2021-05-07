'use strict'

const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

//ToDo: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!//ToDo: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
const RoleSchema = Schema({
  name: {
    type: String,
    validate: 
        {
          validator: function(v) 
          {
              return /^[A-Za-z]+$/.test(v);
          },
          message: "No es válido"
        },
    required: [true,"Este campo es requerido"]    
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description:
    { type: String }
});

//ToDo: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       properties: 
 *         name:
 *           type: "string"  
 *           example: "admin"         
 *         isActive:
 *           type: "boolean"
 *           default: true
 *         description:
 *           type: "string"
 *           example: "Is administrator"
 *       required: 
 *         - name
 */

module.exports = mongoose.model('Role', RoleSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.

