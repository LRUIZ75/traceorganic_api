// Last Updated: 08/06/2021 12:56:40 a. m.
// Updated By  : Luis Danilo Ruiz Tórrez
'use strict'

const certificateModel = require('../models/certificate.model');
const validator = require('validator');
const fs = require('fs');
const path = require('path');
const { ObjectId } = require('mongodb');
const { findOneAndDelete } = require('../models/certificate.model');
const  MSG  = require("../modules/message.module");
const Log = require("cabin");


/**
 * @swagger
 * tags:
 *   name: Certificate
 *   description: Certificate Data
 */

var certificateController = {

    /**
     * @openapi
     * /api/certificate/{id}:
     *   get:
     *     tags: 
     *       - Certificate
     *     summary: GET ONE CERTIFICATE BY ID 
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         description: Certificate ID
     *         required: false
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/Certificate"
     *       404:
     *         description: Not Found
     *       500:
     *         description: Internal Server Error
     */

    /**
     * @openapi
     * /api/certificate:
     *   get:
     *     tags: 
     *       - Certificate
     *     summary: GET ALL CERTIFICATE
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
     *                 $ref: "#/components/schemas/Certificate"
     *       404:
     *         description: Not Found
     *       500:
     *         description: Internal Server Error
     */

    getCertificate: (req, res) => {

        var id = req.params.id;
        
        var payload = req.payload;
        
        /*     if(!containsRole("admin",payload.roles)){
              return res.status(401).send({
                status: "error",
                message: "ROL ADMINISTRADOR REQUERIDO"
              });
            } */

        var query = { '_id': { $eq: id } };

        if (!id || id === undefined) query = {};
        else query = { '_id': { $eq: id } };

        console.log(query);

        certificateModel.find(query, (err, objects) => {


            if (err) {
                return (res.status(500).send({
                    status: "error",
                    message: MSG["500"] + err.message
                })
                );
            }

            if (!objects || objects.length == 0) {
 
                return (res.status(404).send({
                    status: "error",
                    message: MSG["NO-DATA"],
                    links: [ process.env.API_URL + "doc/#/Certificate/post_api_certificate" ]    
                }

                ));
            } else {

                return (res.status(200).send({
                    status: "ok",
                    data: objects
                }));
            }
        });
    },


    /**
     * @openapi
     * /api/certificate:
     *   post:
     *     tags: 
     *       - Certificate
     *     summary: ADD NEW CERTIFICATE
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       required: true
     *       content: 
     *         application/json:
     *           schema:
     *             $ref: "#/components/schemas/Certificate"
     *     responses:
     *       201:
     *         description: Created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/Certificate"
     *       400:
     *         description: Bad Request
     *       500:
     *         description: Internal Server Error
     */
    addCertificate: (req, res) => {


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

            return (res.status(400).send({
                status: "error",
                message: MSG["NO-BODY"]
            })
            );
        }


        var newCertificate = new certificateModel(data);



        //INTENTAR GUARDAR EL NUEVO OBJETO
        newCertificate.save((err, storedObject) => {
            if (err) {
                return (res.status(500).send({
                    status: "error",
                    message: MSG["500"] + err.message
                }));

            } else {
                if (!storedObject) {
                    return (res.status(500).send({
                        status: "error",
                        message: MSG["500"] + err.message
                    }));
                }

                return (res.status(201).send({
                    status: "ok",
                    data: storedObject
                }));
            }

        });
    },


    /**
     * @openapi
     * /api/certificate/{id}:
     *   put:
     *     tags: 
     *       - Certificate
     *     summary: UPDATE ONE CERTIFICATE BY ID
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         description: "Certificate ID"
     *         type: string
     *         required: true
     *     requestBody:
     *       required: true
     *       content: 
     *         application/json:
     *           schema:
     *             $ref: "#/components/schemas/Certificate"
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/Certificate"
     *       400:
     *         description: Bad Request
     *       404:
     *         description: Not Found
     *       500:
     *         description: Internal Server Error
     */
    editCertificate: (req, res) => {

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
            return (res.status(400).send({
                status: "error",
                message: MSG["NO-PARAM"]
            }));
        }
        if (!data || data == undefined) {
            return (res.status(400).send({
                status: "error",
                message: MSG["NO-BODY"]
            }));
        }

        var query = { '_id': { $eq: id } };
        var command = { $set: data };

        certificateModel.findOneAndUpdate(query, command, { new: true }, (err, updatedObject) => {
            if (err) {
                return (res.status(500).send({
                    status: "error",
                    message: MSG["ERROR"] + err.message
                }));
            }

            if (!updatedObject) {

                return (res.status(404).send({
                    status: "error",
                    message: MSG["NO-DATA"]
                }));
            }

            return (res.status(200).send({
                status: "ok",
                data: updatedObject
            }));

        });

    },

    /**
     * @openapi
     * /api/certificate/{id}:
     *   delete:
     *     tags: 
     *       - Certificate
     *     summary: DELETE ONE CERTIFICATE BY ID
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         description: "Certificate ID"
     *         type: string
     *         required: true
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/Certificate"
     *       400:
     *         description: Bad Request
     *       404:
     *         description: Not Found
     *       500:
     *         description: Internal Server Error
     */
    deleteCertificate: (req, res) => {

        var payload = req.payload;
        
        /*     if(!containsRole("admin",payload.roles)){
              return res.status(401).send({
                status: "error",
                message: "ROL ADMINISTRADOR REQUERIDO"
              });
            } */

        var id = req.params.id;
        if (!id || id == undefined) {
            return (res.status(400).send({
                status: "error",
                message: MSG["NO-PARAM"]
            }));
        }

        var query = { '_id': { $eq: id } };

        certificateModel.findOneAndDelete(query, { new: false }, (err, deletedObject) => {
            if (err) {
                return (res.status(500).send({
                    status: "error",
                    message: MSG["500"] + err.message
                }));
            }

            if (!deletedObject) {

                return (res.status(404).send({
                    status: "error",
                    message: MSG["NO-DATA"]
                }));
            }

            return (res.status(200).send({
                status: "ok",
                data: deletedObject
            }));

        });
    },
    

    /**
     * @openapi
     * /api/certificate/{field}/{id}:
     *   put:
     *     tags: 
     *       - Certificate
     *     summary: UPLOAD CERTIFICATE IMAGE BY FIELDNAME AND ID
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
     *         default: "file"
     *         required: true
     *       - in: path
     *         name: id
     *         description: "Certificate Id"
     *         type: string
     *         required: true
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/Certificate"
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
                status: 'error',
                message: MSG["NO-PARAM"]
            });
        }

        if (!id || !fieldname) {
          return res.status(400).send({
            status: "error",
            message: MSG["NO-PARAM"]
          });
        }


        //TODO: Revisar y controlar los campos válidos para imagenes de la colección
        var validFields = ["file"];

        if (!(validFields.includes(fieldname))) {
          return res.status(400).send({
            status: "error",
            message: MSG["NO-DATA"]
          });
        }

        //conseguir nombre y extensión del archivo
        var file_path = req.files.picture.path;
        var file_name = path.basename(file_path);
        var file_ext = path.extname(file_name).toLowerCase();

        const validExtensions = ['.png','.jpg', '.jpeg', '.webp', '.gif'];
        if (validExtensions.includes(file_ext)) 
          {
            //Archivo aceptable

            var query = { _id: { $eq: id } };

            var command = { $set: { [fieldname]: file_name } };

            certificateModel.findOne(query, (err, doc) => {
                if (err)
                  return res.status(500).send({
                    status: "error",
                    message: MSG["500"] + err.message
                  });
                if (doc) {
                      var object = JSON.parse(JSON.stringify(doc._doc));
                      let oldvalue = "./uploads/logo/" + object[fieldname];

                      console.log(`Deleting: ${oldvalue}`);
                      if (fs.existsSync(oldvalue)) fs.unlinkSync(oldvalue);              
                 }});
                 
         certificateModel.findOneAndUpdate(
            query,
            command,
            { new: true },
            (err, updatedObject) => {
              if (err) {
                if (fs.existsSync(file_path)) fs.unlinkSync(file_path);

                return res.status(500).send({
                  status: "error",
                  message: MSG["500"] + err.message
                });
              }

              if (!updatedObject) {
                if (fs.existsSync(file_path)) fs.unlinkSync(file_path);

                return res.status(404).send({
                  status: "error",
                  message: MSG["NO-DATA"]
                });
              }

              return res.status(200).send({
                status: "ok",
                data: updatedObject
              });
            }
          );
        } else {
          //Archivo no aceptado -> Borrar el archivo

          if (fs.existsSync(file_path)) fs.unlinkSync(file_path);

          return res.status(415).send({
            status: "error",
            message: MSG["FILE-TYPE"]
          });
        }
    },


    /**
     * @openapi
     * /api/certificate/images/{filename}:
     *   get:
     *     tags: 
     *       - Certificate
     *     summary: GET CERTIFICATE IMAGE BY FILENAME
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
           return (res.status(400).send({
               status: "error",
               message: MSG["NO-PARAM"]
           }));
       }

       var path_file = './uploads/logo/' + file;

       fs.stat(path_file, (err) => {

           if (err) {

               return res.status(404).send({
                   status: 'error',
                   message: MSG["404"] + ": " + path_file
               });
           }

           return res.status(200).sendFile(path.resolve(path_file));

       });


    }

}

module.exports = certificateController;