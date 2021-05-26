// Last Updated: 14/05/2021 12:49:58 a. m.
// Updated By  : Luis Danilo Ruiz Tórrez
"use strict";

const userModel = require("../models/user.model");
const personModel = require("../models/person.model")
const validator = require("validator");
const fs = require("fs");
const path = require("path");
const { ObjectId } = require("mongodb");
const { findOneAndDelete } = require("../models/user.model");
const MSG = require("../modules/message.module");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User Data
 */

var userController = {
  /**
   * @openapi
   * /api/user/{id}:
   *   get:
   *     tags:
   *       - User
   *     summary: GET ONE USER BY ID
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         description: User Id
   *         required: false
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/User"
   *       404:
   *         description: Not Found
   *       500:
   *         description: Internal Server Error
   */

  /**
   * @openapi
   * /api/user:
   *   get:
   *     tags:
   *       - User
   *     summary: GET ALL USER
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
   *                 $ref: "#/components/schemas/User"
   *       404:
   *         description: Not Found
   *       500:
   *         description: Internal Server Error
   */

  getUser: (req, res) => {
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

    userModel.find(query)
    .populate("person")
    .populate("roles")
    .populate("company")
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
          links: [process.env.API_URL + "doc/#/User/post_api_user"],
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
   * /api/user:
   *   post:
   *     tags:
   *       - User
   *     summary: ADD NEW USER
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/User"
   *     responses:
   *       201:
   *         description: Created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/User"
   *       400:
   *         description: Bad Request
   *       500:
   *         description: Internal Server Error
   */
  addUser: (req, res) => {
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

    var newUser = new userModel(data);

    //INTENTAR GUARDAR EL NUEVO OBJETO
    newUser.save((err, storedObject) => {
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
        personModel.findByIdAndUpdate(storedObject.person, { isUser: true });
        return res.status(201).send({
          status: "ok",
          data: storedObject,
        });
      }
    });
  },

  /**
   * @openapi
   * /api/user/{id}:
   *   put:
   *     tags:
   *       - User
   *     summary: UPDATE ONE USER BY ID
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         description: "User Id"
   *         type: string
   *         required: true
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/User"
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/User"
   *       400:
   *         description: Bad Request
   *       404:
   *         description: Not Found
   *       500:
   *         description: Internal Server Error
   */
  editUser: (req, res) => {
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

    userModel.findOneAndUpdate(
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
        personModel.findByIdAndUpdate(updatedObject.person, { isUser: true });
        return res.status(200).send({
          status: "ok",
          data: updatedObject,
        });
      }
    );
  },

  /**
   * @openapi
   * /api/user/{id}:
   *   delete:
   *     tags:
   *       - User
   *     summary: DELETE ONE USER BY ID
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         description: "User Id"
   *         type: string
   *         required: true
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/User"
   *       400:
   *         description: Bad Request
   *       404:
   *         description: Not Found
   *       500:
   *         description: Internal Server Error
   */
  deleteUser: (req, res) => {
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

    user.findOneAndDelete(query, { new: false }, (err, deletedObject) => {
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
      personModel.findByIdAndUpdate(deletedObject.person, { isUser: false });
      return res.status(200).send({
        status: "ok",
        data: deletedObject,
      });
    });
  },
};

module.exports = userController;
