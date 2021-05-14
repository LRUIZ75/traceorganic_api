// Last Updated: 14/05/2021 12:38:51 a. m.
// Updated By  : LRUIZ
"use strict";

const driverModel = require("../models/driver.model");
const validator = require("validator");
const fs = require("fs");
const path = require("path");
const { ObjectId } = require("mongodb");
const { findOneAndDelete } = require("../models/driver.model");
const MSG = require("../modules/message.module");

/**
 * @swagger
 * tags:
 *   name: Driver
 *   description: Driver Data
 */

var driverController = {
  /**
   * @openapi
   * /api/driver/{id}:
   *   get:
   *     tags:
   *       - Driver
   *     summary: GET ONE DRIVER BY ID
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         description: Driver Id
   *         required: false
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/Driver"
   *       404:
   *         description: Not Found
   *       500:
   *         description: Internal Server Error
   */

  /**
   * @openapi
   * /api/driver:
   *   get:
   *     tags:
   *       - Driver
   *     summary: GET ALL DRIVER
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
   *                 $ref: "#/components/schemas/Driver"
   *       404:
   *         description: Not Found
   *       500:
   *         description: Internal Server Error
   */

  getDriver: (req, res) => {
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

    driverModel.find(query)
    .populate("person")
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
          links: [process.env.API_URL + "doc/#/Driver/post_api_driver"],
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
   * /api/driver:
   *   post:
   *     tags:
   *       - Driver
   *     summary: ADD NEW DRIVER
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/Driver"
   *     responses:
   *       201:
   *         description: Created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/Driver"
   *       400:
   *         description: Bad Request
   *       500:
   *         description: Internal Server Error
   */
  addDriver: (req, res) => {
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

    var newDriver = new driverModel(data);

    //INTENTAR GUARDAR EL NUEVO OBJETO
    newDriver.save((err, storedObject) => {
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
   * /api/driver/{id}:
   *   put:
   *     tags:
   *       - Driver
   *     summary: UPDATE ONE DRIVER BY ID
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         description: "Driver Id"
   *         type: string
   *         required: true
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/Driver"
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/Driver"
   *       400:
   *         description: Bad Request
   *       404:
   *         description: Not Found
   *       500:
   *         description: Internal Server Error
   */
  editDriver: (req, res) => {
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

    driverModel.findOneAndUpdate(
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
   * /api/driver/{id}:
   *   delete:
   *     tags:
   *       - Driver
   *     summary: DELETE ONE DRIVER BY ID
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         description: "Driver Id"
   *         type: string
   *         required: true
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/Driver"
   *       400:
   *         description: Bad Request
   *       404:
   *         description: Not Found
   *       500:
   *         description: Internal Server Error
   */
  deleteDriver: (req, res) => {
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

    driver.findOneAndDelete(query, { new: false }, (err, deletedObject) => {
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

  /**
   * @openapi
   * /api/driver/{field}/{id}:
   *   put:
   *     tags:
   *       - Driver
   *     summary: UPLOAD DRIVER LICENSECARD | INSURANCECARD BY ID
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               picture:
   *                 type: string
   *                 format: base64
   *     parameters:
   *       - in: path
   *         name: field
   *         description: "fieldname for image"
   *         type: string
   *         default: "licenseCard | insuranceCard"
   *         required: true
   *       - in: path
   *         name: id
   *         description: "Driver Id"
   *         type: string
   *         required: true
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/Driver"
   *       400:
   *         description: Bad Request
   *       404:
   *         description: Not Found   
   *       415:
   *         description: Unsupported Media Type
   *       500:
   *         description: Internal Server Error
   */
  setPicture: (req, res) => {
    //description: 'Archivo grafico: PNG JPEG GIF' ,

    var payload = req.payload;

    /*     if(!containsRole("admin",payload.roles)){
              return res.status(401).send({
                status: "error",
                message: "ROL ADMINISTRADOR REQUERIDO"
              });
            } */

    //recojer fichero de petición
    var file_name = "Imagen no proporcionada...";
    var id = req.params.id;
    var fieldname = req.params.field;

    // console.log(req.files);

    if (!req.files.picture) {
      return res.status(400).send({
        status: "error",
        message: MSG["NO-PARAM"],
      });
    }

    if (!id || !fieldname) {
      return res.status(400).send({
        status: "error",
        message: MSG["NO-PARAM"],
      });
    }

    //TODO: Revisar y controlar los campos válidos para imagenes de la colección
    var validFields = ["licenseCard", "insuranceCard"];

    if (!(fieldname in validFields)) {
      return res.status(400).send({
        status: "error",
        message: MSG["NO-DATA"],
      });
    }

    //conseguir nombre y extensión del archivo
    var file_path = req.files.picture.path;

    var file_name = path.basename(file_path);

    var file_ext = path.extname(file_name).toLowerCase();
    var oldValue = "";

    const validExtensions = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
    if (validExtensions.includes(file_ext)) {
      //Archivo aceptable

      var query = { _id: { $eq: id } };

      var command = { $set: { [fieldname]: file_name } };

      driver.findOne(query, (err, doc) => {
        if (err)
          return res.status(500).send({
            status: "error",
            message: MSG["500"] + err.message,
          });
        if (doc) {
          var object = JSON.parse(JSON.stringify(doc._doc));
          oldvalue = object[fieldname];
          oldvalue = "./uploads/pictures/" + oldvalue;
          console.log(`Deleting: ${oldvalue}`);
          fs.unlinkSync(oldvalue);
        }
      });
      driver.findOneAndUpdate(
        query,
        command,
        { new: true },
        (err, updatedObject) => {
          if (err) {
            fs.unlinkSync(file_path);

            return res.status(500).send({
              status: "error",
              message: MSG["500"] + err.message,
            });
          }

          if (!updatedObject) {
            fs.unlinkSync(file_path);

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
    } else {
      //Archivo no aceptado

      //Borrar el archivo

      fs.unlinkSync(file_path);

      return res.status(415).send({
        status: "error",
        message: MSG["FILE-TYPE"],
      });
    }
  },

  /**
   * @openapi
   * /api/driver/picture/{filename}:
   *   get:
   *     tags:
   *       - Driver
   *     summary: GET DRIVER PICTURE BY FILENAME
   *     parameters:
   *       - in: path
   *         name: filename
   *         description: Image filename
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           image/png:
   *             type: image
   *       400:
   *         description: Bad Request
   *       404:
   *         description: Not Found
   *       500:
   *         description: Internal Server Error
   */
  getPicture: (req, res) => {
    var payload = req.payload;

    /*     if(!containsRole("admin",payload.roles)){
              return res.status(401).send({
                status: "error",
                message: "ROL ADMINISTRADOR REQUERIDO"
              });
            } */

    var file = req.params.filename;
    if (validator.isEmpty(file)) {
      return res.status(400).send({
        status: "error",
        message: MSG["NO-PARAM"],
      });
    }

    var path_file = "./uploads/pictures/" + file;

    fs.stat(path_file, (err) => {
      if (err) {
        return res.status(404).send({
          status: "error",
          message: MSG["404"] + ": " + path_file,
        });
      }

      return res.status(200).sendFile(path.resolve(path_file));
    });
  },
};

module.exports = driverController;
