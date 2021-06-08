"use strict";

const mongoose = require("mongoose");
const validator = require("validator");

const bcrypt = require("bcryptjs");

const SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;

const UserSchema = Schema({
  username: {
    type: String,
    required: [true, "ES REQUERIDO"],
    index: { unique: true },
    minLength: 5,
    maxLength: 20,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
    minLength: 8,
    required: [true, "ES REQUERIDO"],
    set: (v) => {
      var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
      var hash = bcrypt.hashSync(v, salt);
      return hash;
    },
  },
  person: {
    type: Schema.Types.ObjectId,
    index: { unique: true },
    ref: "Person",
    required: [true, "ES REQUERIDO"],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    index: { unique: true },
    required: [true, "ES REQUERIDO"],
    validate: {
      validator: validator.isEmail,
      message: "{VALUE} no es una dirección de correo válida",
      isAsync: false,
    },
  },
  isVerifiedEmail: {
    type: Boolean,
    default: false,
  },
  creationDate: {
    type: Date,
    default: Date.now(),
  },
  roles: {
    type: Array(Schema.Types.ObjectId),
    ref: "Role",
    required: [true, "ES REQUERIDO"],
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: [true, "ES REQUERIDO"],
  },
  refreshAccessToken: {
    type: String,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       properties:
 *         username:
 *           type: "string"
 *           example: "admin"
 *         password:
 *           type: "string"
 *           format: "password"
 *           example: "P@55w0rd"
 *         person:
 *           type: "string"
 *           format: "oid"
 *           example: "123456123456123456123456"
 *         email:
 *           type: "string"
 *           format: "email"
 *           example: "no-one@nowhere.com"
 *         isVerifiedEmail:
 *           type: "boolean"
 *           example: "false"
 *         creationDate:
 *           type: "string"
 *           format: "date"
 *         roles:
 *            type: "array"
 *            items:
 *              type: "string"
 *              format: oid
 *         company:
 *           type: "string"
 *           format: "oid"
 *         refreshAccessToken:
 *           type: "string"
 *         isActive:
 *           type: "boolean"
 *           default: false
 *       required:
 *         - username
 *         - password
 *         - person
 *         - email
 *         - company
 *
 */

module.exports = mongoose.model("User", UserSchema);
// mongoDB creará la collección, con documentos de estructura del modelo.
