"use strict";

const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;

//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
const RoleActionSchema = Schema({
  role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    required: [true, "ES REQUERIDO"],
  },
  actionName: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[A-Za-z ]+$/.test(v);
      },
      message: "NO VÁLIDO",
    },
    required: [true, "ES REQUERIDO"],
  },
  filterByCompany: {
    type: Boolean,
    default: false,
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
 *         role:
 *           type: "string"
 *           format: "oid"
 *         actionName:
 *           type: "string"
 *         filterByCompany:
 *           type: boolean
 *           default: false
 *         isActive:
 *           type: boolean
 *           default: true
 *       required:
 *         - role
 *         - actionName
 */

module.exports = mongoose.model("RoleAction", RoleActionSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.
