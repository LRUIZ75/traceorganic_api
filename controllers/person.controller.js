// Last Updated: 14/05/2021 12:30:29 a. m.
// Updated By  : LRUIZ
"use strict";

const personModel = require("../models/person.model");
const validator = require("validator");
const fs = require("fs");
const path = require("path");
const { ObjectId } = require("mongodb");
const { findOneAndDelete } = require("../models/person.model");
const MSG = require("../modules/message.module");

/**
 * @swagger
 * tags:
 *   name: Person
 *   description: Person Data
 */

var personController = {
  /**
   * @openapi
   * /api/person/{id}:
   *   get:
   *     tags:
   *       - Person
   *     summary: GET ONE PERSON BY ID
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         description: Person Id
   *         required: false
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/Person"
   *       404:
   *         description: Not Found
   *       500:
   *         description: Internal Server Error
   */

  /**
   * @openapi
   * /api/person:
   *   get:
   *     tags:
   *       - Person
   *     summary: GET ALL PERSON
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
   *                 $ref: "#/components/schemas/Person"
   *       404:
   *         description: Not Found
   *       500:
   *         description: Internal Server Error
   */

  getPerson: (req, res) => {
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

    personModel.find(query, (err, objects) => {
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
          links: [process.env.API_URL + "doc/#/Person/post_api_person"],
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
   * /api/person:
   *   post:
   *     tags:
   *       - Person
   *     summary: ADD NEW PERSON
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/Person"
   *     responses:
   *       201:
   *         description: Created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/Person"
   *       400:
   *         description: Bad Request
   *       500:
   *         description: Internal Server Error
   */
  addPerson: (req, res) => {
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

    var newPerson = new personModel(data);

    //INTENTAR GUARDAR EL NUEVO OBJETO
    newPerson.save((err, storedObject) => {
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
   * /api/person/{id}:
   *   put:
   *     tags:
   *       - Person
   *     summary: UPDATE ONE PERSON BY ID
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         description: "Person Id"
   *         type: string
   *         required: true
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/Person"
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/Person"
   *       400:
   *         description: Bad Request
   *       404:
   *         description: Not Found
   *       500:
   *         description: Internal Server Error
   */
  editPerson: (req, res) => {
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

    personModel.findOneAndUpdate(
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
   * /api/person/{id}:
   *   delete:
   *     tags:
   *       - Person
   *     summary: DELETE ONE PERSON BY ID
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         description: "Person Id"
   *         type: string
   *         required: true
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/Person"
   *       400:
   *         description: Bad Request
   *       404:
   *         description: Not Found
   *       500:
   *         description: Internal Server Error
   */
  deletePerson: (req, res) => {
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

    person.findOneAndDelete(query, { new: false }, (err, deletedObject) => {
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
   * /api/person/{field}/{id}:
   *   put:
   *     tags:
   *       - Person
   *     summary: UPLOAD PERSON PICTURE BY ID
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
   *         default: "picture"
   *         required: true
   *       - in: path
   *         name: id
   *         description: "Person Id"
   *         type: string
   *         required: true
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/Person"
   *       400:
   *         description: Bad Request
   *       404:
   *         description: Not Found
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
    var validFields = ["picture"];

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

      person.findOne(query, (err, doc) => {
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
      person.findOneAndUpdate(
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

      return res.status(400).send({
        status: "error",
        message: MSG["FILE-TYPE"],
      });
    }
  },

  /**
   * @openapi
   * /api/person/picture/{filename}:
   *   get:
   *     tags:
   *       - Person
   *     summary: GET PERSON PICTURE BY FILENAME
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

module.exports = personController;
