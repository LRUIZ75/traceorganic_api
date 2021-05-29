"use strict";

const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;

//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!//TODO: Una vez generado, estos modelos requeren modificación manual para ajustar sus propiedades y validaciones!!!
const CountrySchema = Schema({
  name: {
    common: {
      type: String
    },
    official: {
      type: String
    },
  },
  cca2: {
    type: String
  },
  cca3: {
    type: String
  }
});

module.exports = mongoose.model("Country", CountrySchema);
// mongoDB creará la collección, con documentos de estructura del modelo.


/**
 * @swagger
 * components:
 *   schemas:
 *     Country:
 *       properties:
 *         name: 
 *           type: object
 *           properties:
 *             common:
 *               type: string
 *             official:
 *               type: string
 *         cca2:
 *           type: string
 *         cca3:
 *           type: string
 */