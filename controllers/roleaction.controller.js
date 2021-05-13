// Last Updated: 08/05/2021 08:51:01 p. m.
// Updated By  : @YourName
"use strict";

const os = require("os");
const roleactionModel = require("../models/roleaction.model");
const validator = require("validator");
const fs = require("fs");
const path = require("path");
const { ObjectId } = require("mongodb");
const { findOneAndDelete } = require("../models/roleaction.model");

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

    var query = { _id: { $eq: id } };

    if (!id || id === undefined) query = {};
    else query = { _id: { $eq: id } };

    //console.log(query);

    roleactionModel
      .find(query)
      .populate("role")
      .exec((err, objects) => {
        if (err) {
          return res.status(500).send({
            status: "error",
            message: err.message,
          });
        }

        if (!objects || objects.length == 0) {
          return res.status(404).send({
            status: "error",
            message: "Registro(s) no encontrado(s)",
            links: [
              {
                "Agregar registro => curl -X POST ":
                process.env.API_URL + "/api/roleaction",
              },
            ],
          });
        } else {
          return res.status(200).send({
            status: "ok",
            objects: objects,
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

    //SIN PARAMETROS
    if (!data) {
      return res.status(400).send({
        status: "error",
        message: "Faltan parámetros de request en formato JSON",
      });
    }

    var newRoleAction = new roleactionModel(data);

    //INTENTAR GUARDAR EL NUEVO OBJETO
    newRoleAction.save((err, storedObject) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: err.message,
        });
      } else {
        if (!storedObject) {
          return res.status(500).send({
            status: "error",
            message: "Error al intentar guardar un nuevo registro",
          });
        }

        return res.status(201).send({
          status: "ok",
          created: storedObject,
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

    if (!id || id == undefined) {
      return res.status(400).send({
        status: "error",
        message: "falta parámetro requerido ID",
      });
    }
    if (!data || data == undefined) {
      return res.status(400).send({
        status: "error",
        message: "falta parámetro requerido data JSON",
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
            message: err.message,
          });
        }

        if (!updatedObject) {
          return res.status(404).send({
            status: "error",
            message: "No se encontró el registro a modificar",
          });
        }

        return res.status(200).send({
          status: "ok",
          updated: updatedObject,
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
    var id = req.params.id;
    if (!id || id == undefined) {
      return res.status(400).send({
        status: "error",
        message: "falta parámetro requerido ID",
      });
    }

    var query = { _id: { $eq: id } };

    roleaction.findOneAndDelete(query, { new: false }, (err, deletedObject) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: err.message,
        });
      }

      if (!deletedObject) {
        return res.status(404).send({
          status: "error",
          message: "No se encontró el registro a eliminar",
        });
      }

      return res.status(200).send({
        status: "ok",
        deleted: deletedObject,
      });
    });
  },
};

module.exports = roleactionController;
