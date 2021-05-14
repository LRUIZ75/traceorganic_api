// Last Updated: 14/05/2021 12:43:55 a. m.
// Updated By  : LRUIZ
"use strict";

const roleactionModel = require("../models/roleaction.model");
const validator = require("validator");
const fs = require("fs");
const path = require("path");
const { ObjectId } = require("mongodb");
const { findOneAndDelete } = require("../models/roleaction.model");
const MSG = require("../modules/message.module");

/**
 * @swagger
 * tags:
 *   name: RoleAction
 *   description: Role Actions Data
 */

var roleactionController = {
  /**
   * @openapi
   * /api/roleaction/{id}:
   *   get:
   *     tags:
   *       - RoleAction
   *     summary: GET ONE ROLEACTION BY ID
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         description: RoleAction Id
   *         required: false
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/RoleAction"
   *       404:
   *         description: Not Found
   *       500:
   *         description: Internal Server Error
   */

  /**
   * @openapi
   * /api/roleaction:
   *   get:
   *     tags:
   *       - RoleAction
   *     summary: GET ALL ROLEACTION
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: "#/components/schemas/RoleAction"
   *       404:
   *         description: Not Found
   *       500:
   *         description: Internal Server Error
   */

  getRoleAction: (req, res) => {
    var id = req.params.id;

    var payload = req.payload;

    /*     if(!containsRole("admin",payload.roles)){
              return res.status(401).send({
                status: "error",
                message: "ROL ADMINISTRADOR REQUERIDO"
              });
            } */

    var query = { _id: { $eq: id } };

    if (!id || id === undefined) query = {};
    else query = { _id: { $eq: id } };

    console.log(query);

    roleactionModel.find(query)
    .populate("role")
    .exec((err, objects) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: MSG["500"] + err.message,
        });
      }

      if (!objects || objects.length == 0) {
        return res.status(404).send({
          status: "error",
          message: MSG["NO-DATA"],
          links: [process.env.API_URL + "doc/#/RoleAction/post_api_roleaction"],
        });
      } else {
        return res.status(200).send({
          status: "ok",
          data: objects,
        });
      }
    });
  },

  /**
   * @openapi
   * /api/roleaction:
   *   post:
   *     tags:
   *       - RoleAction
   *     summary: ADD NEW ROLEACTION
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/RoleAction"
   *     responses:
   *       201:
   *         description: Created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/RoleAction"
   *       400:
   *         description: Bad Request
   *       500:
   *         description: Internal Server Error
   */
  addRoleAction: (req, res) => {
    var data = req.body;

    var payload = req.payload;

    /*     if(!containsRole("admin",payload.roles)){
              return res.status(401).send({
                status: "error",
                message: "ROL ADMINISTRADOR REQUERIDO"
              });
            } */

    //SIN PARAMETROS
    if (!data) {
      return res.status(400).send({
        status: "error",
        message: MSG["NO-BODY"],
      });
    }

    var newRoleAction = new roleactionModel(data);

    //INTENTAR GUARDAR EL NUEVO OBJETO
    newRoleAction.save((err, storedObject) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: MSG["500"] + err.message,
        });
      } else {
        if (!storedObject) {
          return res.status(500).send({
            status: "error",
            message: MSG["500"] + err.message,
          });
        }

        return res.status(201).send({
          status: "ok",
          data: storedObject,
        });
      }
    });
  },

  /**
   * @openapi
   * /api/roleaction/{id}:
   *   put:
   *     tags:
   *       - RoleAction
   *     summary: UPDATE ONE ROLEACTION BY ID
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         description: "RoleAction Id"
   *         type: string
   *         required: true
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/RoleAction"
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/RoleAction"
   *       400:
   *         description: Bad Request
   *       404:
   *         description: Not Found
   *       500:
   *         description: Internal Server Error
   */
  editRoleAction: (req, res) => {
    var id = req.params.id;
    var data = req.body;

    var payload = req.payload;

    /*     if(!containsRole("admin",payload.roles)){
              return res.status(401).send({
                status: "error",
                message: "ROL ADMINISTRADOR REQUERIDO"
              });
            } */

    if (!id || id == undefined) {
      return res.status(400).send({
        status: "error",
        message: MSG["NO-PARAM"],
      });
    }
    if (!data || data == undefined) {
      return res.status(400).send({
        status: "error",
        message: MSG["NO-BODY"],
      });
    }

    var query = { _id: { $eq: id } };
    var command = { $set: data };

    roleactionModel.findOneAndUpdate(
      query,
      command,
      { new: true },
      (err, updatedObject) => {
        if (err) {
          return res.status(500).send({
            status: "error",
            message: MSG["ERROR"] + err.message,
          });
        }

        if (!updatedObject) {
          return res.status(404).send({
            status: "error",
            message: MSG["NO-DATA"],
          });
        }

        return res.status(200).send({
          status: "ok",
          data: updatedObject,
        });
      }
    );
  },

  /**
   * @openapi
   * /api/roleaction/{id}:
   *   delete:
   *     tags:
   *       - RoleAction
   *     summary: DELETE ONE ROLEACTION BY ID
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         description: "RoleAction Id"
   *         type: string
   *         required: true
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/RoleAction"
   *       400:
   *         description: Bad Request
   *       404:
   *         description: Not Found
   *       500:
   *         description: Internal Server Error
   */
  deleteRoleAction: (req, res) => {
    var payload = req.payload;

    /*     if(!containsRole("admin",payload.roles)){
              return res.status(401).send({
                status: "error",
                message: "ROL ADMINISTRADOR REQUERIDO"
              });
            } */

    var id = req.params.id;
    if (!id || id == undefined) {
      return res.status(400).send({
        status: "error",
        message: MSG["NO-PARAM"],
      });
    }

    var query = { _id: { $eq: id } };

    roleaction.findOneAndDelete(query, { new: false }, (err, deletedObject) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: MSG["500"] + err.message,
        });
      }

      if (!deletedObject) {
        return res.status(404).send({
          status: "error",
          message: MSG["NO-DATA"],
        });
      }

      return res.status(200).send({
        status: "ok",
        data: deletedObject,
      });
    });
  },
};

module.exports = roleactionController;
