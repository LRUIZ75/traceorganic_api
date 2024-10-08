﻿// Last Updated: 26/05/2021 02:23:33 p. m.
// Updated By  : Luis Danilo Ruiz Tórrez
"use strict";

const companyModel = require("../models/company.model");
const validator = require("validator");
const fs = require("fs");
const path = require("path");
const { ObjectId } = require("mongodb");
const { findOneAndDelete } = require("../models/company.model");
const MSG = require("../modules/message.module");
const Log = require("cabin");
const jsonexport = require("jsonexport");
const securable = require("../modules/security.module");

/**
 * @swagger
 * tags:
 *   name: Company
 *   description: Company Data
 */

var companyController = {
  /**
   * @openapi
   * /api/company/{id}:
   *   get:
   *     tags:
   *       - Company
   *     summary: GET ONE COMPANY BY ID
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         description: Company ID
   *         required: false
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/Company"
   *       404:
   *         description: Not Found
   *       500:
   *         description: Internal Server Error
   */

  /**
   * @openapi
   * /api/company:
   *   get:
   *     tags:
   *       - Company
   *     summary: GET ALL COMPANY
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
   *                 $ref: "#/components/schemas/Company"
   *       404:
   *         description: Not Found
   *       500:
   *         description: Internal Server Error
   */

  getCompany: (req, res) => {
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

    companyModel.find(query, (err, objects) => {
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
          links: [process.env.API_URL + "doc/#/Company/post_api_company"],
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
   * /api/csv/company:
   *   get:
   *     tags:
   *       - Company
   *     summary: GET ALL COMPANY AS CSV
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/text:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: "#/components/schemas/Company"
   *       401:
   *         description: Not Authorized
   *       404:
   *         description: Not Found
   *       500:
   *         description: Internal Server Error
   */

   getCompanyCSV: async (req, res) => {

    var payload = req.payload;
    
    var isSuper = await securable.hasRole("superadmin", payload.roles);
    var isData =  await securable.hasRole("dataretriever", payload.roles);
    
    if (!(isSuper || isData)) {
      return res.status(401).send({
        status: "error",
        message: MSG["NO-PERM"],
      });
    }

    var filterByCompany = {};
    if(isData){
      filterByCompany = { _id: { $eq: payload.company} };}

    console.log(filterByCompany);

    
    companyModel.find()
    .where(filterByCompany)
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
          links: [process.env.API_URL + "doc/#/Company/post_api_company"],
        });
      } else {
        let json = JSON.parse(JSON.stringify(objects));
        res.setHeader("content-type", "text/plain");
        jsonexport(json, function (err, csv) {
          if (err) {
            return res.status(500).send({
              status: "error",
              message: MSG["500"] + err.message,
            });
          }
          if (csv) return res.status(200).send(csv);
        });
      }
    });
  },

  /**
   * @openapi
   * /api/company:
   *   post:
   *     tags:
   *       - Company
   *     summary: ADD NEW COMPANY
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/Company"
   *     responses:
   *       201:
   *         description: Created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/Company"
   *       400:
   *         description: Bad Request
   *       500:
   *         description: Internal Server Error
   */
  addCompany: (req, res) => {
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

    var newCompany = new companyModel(data);

    //INTENTAR GUARDAR EL NUEVO OBJETO
    newCompany.save((err, storedObject) => {
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
   * /api/company/{id}:
   *   put:
   *     tags:
   *       - Company
   *     summary: UPDATE ONE COMPANY BY ID
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         description: "Company ID"
   *         type: string
   *         required: true
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/Company"
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/Company"
   *       400:
   *         description: Bad Request
   *       404:
   *         description: Not Found
   *       500:
   *         description: Internal Server Error
   */
  editCompany: (req, res) => {
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

    companyModel.findOneAndUpdate(
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
   * /api/company/{id}:
   *   delete:
   *     tags:
   *       - Company
   *     summary: DELETE ONE COMPANY BY ID
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         description: "Company ID"
   *         type: string
   *         required: true
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/Company"
   *       400:
   *         description: Bad Request
   *       404:
   *         description: Not Found
   *       500:
   *         description: Internal Server Error
   */
  deleteCompany: (req, res) => {
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

    companyModel.findOneAndDelete(
      query,
      { new: false },
      (err, deletedObject) => {
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
      }
    );
  },

  /**
   * @openapi
   * /api/company/{field}/{id}:
   *   put:
   *     tags:
   *       - Company
   *     summary: UPLOAD COMPANY IMAGE BY FIELDNAME AND ID
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
   *         default: "logo"
   *         required: true
   *       - in: path
   *         name: id
   *         description: "Company Id"
   *         type: string
   *         required: true
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/Company"
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
    var validFields = ["logo"];

    if (!validFields.includes(fieldname)) {
      return res.status(400).send({
        status: "error",
        message: MSG["NO-DATA"],
      });
    }

    //conseguir nombre y extensión del archivo
    var file_path = req.files.picture.path;
    var file_name = path.basename(file_path);
    var file_ext = path.extname(file_name).toLowerCase();

    const validExtensions = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
    if (validExtensions.includes(file_ext)) {
      //Archivo aceptable

      var query = { _id: { $eq: id } };

      var command = { $set: { [fieldname]: file_name } };

      companyModel.findOne(query, (err, doc) => {
        if (err)
          return res.status(500).send({
            status: "error",
            message: MSG["500"] + err.message,
          });
        if (doc) {
          var object = JSON.parse(JSON.stringify(doc._doc));
          let oldvalue = "./uploads/logo/" + object[fieldname];

          console.log(`Deleting: ${oldvalue}`);
          if (fs.existsSync(oldvalue)) fs.unlinkSync(oldvalue);
        }
      });

      companyModel.findOneAndUpdate(
        query,
        command,
        { new: true },
        (err, updatedObject) => {
          if (err) {
            if (fs.existsSync(file_path)) fs.unlinkSync(file_path);

            return res.status(500).send({
              status: "error",
              message: MSG["500"] + err.message,
            });
          }

          if (!updatedObject) {
            if (fs.existsSync(file_path)) fs.unlinkSync(file_path);

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
      //Archivo no aceptado -> Borrar el archivo

      if (fs.existsSync(file_path)) fs.unlinkSync(file_path);

      return res.status(415).send({
        status: "error",
        message: MSG["FILE-TYPE"],
      });
    }
  },

  /**
   * @openapi
   * /api/company/images/{filename}:
   *   get:
   *     tags:
   *       - Company
   *     summary: GET COMPANY IMAGE BY FILENAME
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

    var path_file = "./uploads/logo/" + file;

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

module.exports = companyController;
