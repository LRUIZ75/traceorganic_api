"use strict";

const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;

//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
const RoleSchema = Schema({
  name: {
    type: String,
    trim: true,
    index: { unique: true },
    validate: {
      validator: function (v) {
        return /^[A-Za-z]+$/.test(v);
      },
      message: "NO VÁLIDO",
    },
    required: [true, "ES REQUERIDO"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    default: null,
  },
});

//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       properties:
 *         name:
 *           type: string
 *           example: "admin"
 *         isActive:
 *           type: boolean
 *           default: true
 *         description:
 *           type: "string"
 *           default: null
 *       required:
 *         - name
 */

module.exports = mongoose.model("Role", RoleSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.
