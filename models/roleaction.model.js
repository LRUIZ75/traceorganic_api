"use strict";

const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;

//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
const RoleActionSchema = Schema({

  actionName: {
    type: String,
    trim: true,
    required: [true, "ES REQUERIDO"],
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    required: [true, "ES REQUERIDO"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
/**
 * @swagger
 * components:
 *   schemas:
 *     RoleAction:
 *       properties:
 *         actionName:
 *           type: "string"
 *           example: "READALL_COMPANY"
 *         role:
 *           type: "string"
 *           format: "oid"
 *           example: "123456123456123456123456"
 *         isActive:
 *           type: boolean
 *           example: true
 *       required:
 *         - role
 *         - actionName
 */

module.exports = mongoose.model("RoleAction", RoleActionSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.
