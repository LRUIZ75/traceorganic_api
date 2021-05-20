// Last Updated: 14/05/2021 12:40:31 a. m.
// Updated By  : LRUIZ
"use strict";

const countryModel = require("../models/country.model");
const { ObjectId } = require("mongodb");
const { findOneAndDelete } = require("../models/country.model");
const MSG = require("../modules/message.module");

/**
 * @swagger
 * tags:
 *   name: Country
 *   description: Countries Data
 */

var countryController = {
  /**
   * @openapi
   * /api/country/{cca3}:
   *   get:
   *     tags:
   *       - Country
   *     summary: GET ONE COUNTRY BY CCA3
   *     parameters:
   *       - in: path
   *         name: cca3
   *         description: COUNTRY CCA3
   *         required: false
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/Country"
   *       404:
   *         description: Not Found
   *       500:
   *         description: Internal Server Error
   */

  /**
   * @openapi
   * /api/country:
   *   get:
   *     tags:
   *       - Country
   *     summary: GET ALL COUNTRIES
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: "#/components/schemas/Country"
   *       204:
   *         description: No Content
   *       404:
   *         description: Not Found
   *       500:
   *         description: Internal Server Error
   */

  getCountry: (req, res) => {
    var cca3 = req.params.cca3;


    /*     if(!containsRole("admin",payload.roles)){
              return res.status(401).send({
                status: "error",
                message: "ROL ADMINISTRADOR REQUERIDO"
              });
            } */

    var query = { cca3: { $eq: cca3 } };

    if (!cca3 || cca3 === undefined) query = {};
    else query = { cca3: { $eq: cca3 } };

    console.log(query);

    countryModel.find(query)
    .select({cca2: 1, cca3: 1, "name.common":1, _id:0})
    .exec((err, objects) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: MSG["500"] + err.message,
        });
      }

      if (!objects || objects.length == 0) {
        var retStatus = (!cca3)?204:404; //NO CONTENT | NOT FOUND
        return res.status(retStatus).send({
          status: (!cca3)?"ok":"error",
          message: (!cca3)?MSG["NO-DATA"]:MSG["404"],
          data: [],
          links: [process.env.API_URL + "doc/#/Country/post_api_country"],
        });
      } else {
        return res.status(200).send({
          status: "ok",
          data: objects,
        });
      }
    });
  },

};

module.exports = countryController;
