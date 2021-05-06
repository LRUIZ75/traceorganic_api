// Last Updated: 05/05/2021 04:07:40 a. m.
// Updated By  : @YourName
'use strict'

const os = require('os');
const vehicleModel = require('../models/vehicle.model');
const validator = require('validator');
const fs = require('fs');
const path = require('path');
const { ObjectId } = require('mongodb');
const { findOneAndDelete } = require('../models/vehicle.model');


/**
 * @swagger
 * tags:
 *   name: Vehicle
 *   description: Transportation Vehicle Data
 */

var vehicleController = {

    /**
     * @openapi
     * /api/vehicle/{id}:
     *   get:
     *     tags: 
     *       - Vehicle
     *     summary: GET ONE VEHICLE BY ID 
     *     parameters:
     *       - in: path
     *         name: id
     *         description: Vehicle Id
     *         required: false
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/Vehicle"
     *       404:
     *         description: Not Found
     *       500:
     *         description: Internal Server Error
     */

    /**
     * @openapi
     * /api/vehicle:
     *   get:
     *     tags: 
     *       - Vehicle
     *     summary: GET ALL VEHICLE
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: "#/components/schemas/Vehicle"
     *       404:
     *         description: Not Found
     *       500:
     *         description: Internal Server Error
     */

    getVehicle: (req, res) => {

        var id = req.params.id;

        var query = { '_id': { $eq: id } };

        if (!id || id === undefined) query = {};
        else query = { '_id': { $eq: id } };

        console.log(query);

        vehicleModel.find(query, (err, objects) => {


            if (err) {
                return (res.status(500).send({
                    status: "error",
                    message: err.message
                })
                );
            }

            if (!objects || objects.length == 0) {
 
                return (res.status(404).send({
                    status: "error",
                    message: "Registro(s) no encontrado(s)",
                    links: [{ "Agregar registro => curl -X POST ": global.baseURL + "/api/vehicle" }]
                }

                ));
            } else {

                return (res.status(200).send({
                    status: "ok",
                    objects: objects
                }));
            }
        });
    },


    /**
     * @openapi
     * /api/vehicle:
     *   post:
     *     tags: 
     *       - Vehicle
     *     summary: ADD NEW VEHICLE
     *     requestBody:
     *       required: true
     *       content: 
     *         application/json:
     *           schema:
     *             $ref: "#/components/schemas/Vehicle"
     *     responses:
     *       201:
     *         description: Created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/Vehicle"
     *       400:
     *         description: Bad Request
     *       500:
     *         description: Internal Server Error
     */
    addVehicle: (req, res) => {


        var data = req.body;


        //SIN PARAMETROS
        if (!data) {

            return (res.status(400).send({
                status: "error",
                message: "Faltan parámetros de request en formato JSON"
            })
            );
        }


        var newVehicle = new vehicleModel(data);



        //INTENTAR GUARDAR EL NUEVO OBJETO
        newVehicle.save((err, storedObject) => {
            if (err) {
                return (res.status(500).send({
                    status: "error",
                    message: err.message
                }));

            } else {
                if (!storedObject) {
                    return (res.status(500).send({
                        status: "error",
                        message: "Error al intentar guardar un nuevo registro"
                    }));
                }

                return (res.status(201).send({
                    status: "ok",
                    created: storedObject
                }));
            }

        });
    },


    /**
     * @openapi
     * /api/vehicle/{id}:
     *   put:
     *     tags: 
     *       - Vehicle
     *     summary: UPDATE ONE VEHICLE BY ID
     *     parameters:
     *       - in: path
     *         name: id
     *         description: "Vehicle Id"
     *         type: string
     *         required: true
     *     requestBody:
     *       required: true
     *       content: 
     *         application/json:
     *           schema:
     *             $ref: "#/components/schemas/Vehicle"
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/Vehicle"
     *       400:
     *         description: Bad Request
     *       404:
     *         description: Not Found
     *       500:
     *         description: Internal Server Error
     */
    editVehicle: (req, res) => {

        var id = req.params.id;
        var data = req.body;

        if (!id || id == undefined) {
            return (res.status(400).send({
                status: "error",
                message: "falta parámetro requerido ID"
            }));
        }
        if (!data || data == undefined) {
            return (res.status(400).send({
                status: "error",
                message: "falta parámetro requerido data JSON"
            }));
        }

        var query = { '_id': { $eq: id } };
        var command = { $set: data };

        vehicleModel.findOneAndUpdate(query, command, { new: true }, (err, updatedObject) => {
            if (err) {
                return (res.status(500).send({
                    status: "error",
                    message: err.message
                }));
            }

            if (!updatedObject) {

                return (res.status(404).send({
                    status: "error",
                    message: "No se encontró el registro a modificar"
                }));
            }

            return (res.status(200).send({
                status: "ok",
                updated: updatedObject
            }));

        });

    },

    /**
     * @openapi
     * /api/vehicle/{id}:
     *   delete:
     *     tags: 
     *       - Vehicle
     *     summary: DELETE ONE VEHICLE BY ID
     *     parameters:
     *       - in: path
     *         name: id
     *         description: "Vehicle Id"
     *         type: string
     *         required: true
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/Vehicle"
     *       400:
     *         description: Bad Request
     *       404:
     *         description: Not Found
     *       500:
     *         description: Internal Server Error
     */
    deleteVehicle: (req, res) => {


        var id = req.params.id;
        if (!id || id == undefined) {
            return (res.status(400).send({
                status: "error",
                message: "falta parámetro requerido ID"
            }));
        }

        var query = { '_id': { $eq: id } };

        vehicle.findOneAndDelete(query, { new: false }, (err, deletedObject) => {
            if (err) {
                return (res.status(500).send({
                    status: "error",
                    message: err.message
                }));
            }

            if (!deletedObject) {

                return (res.status(404).send({
                    status: "error",
                    message: "No se encontró el registro a eliminar"
                }));
            }

            return (res.status(200).send({
                status: "ok",
                deleted: deletedObject
            }));

        });
    },
    

    /**
     * @openapi
     * /api/vehicle/{field}/{id}:
     *   put:
     *     tags: 
     *       - Vehicle
     *     summary: UPLOAD VEHICLE PICTURE BY ID
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
     *         description: "fieldname for picture"
     *         type: string
     *         default: "insuranceCard"
     *         required: true
     *       - in: path
     *         name: id
     *         description: "Vehicle Id"
     *         type: string
     *         required: true
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/Vehicle"
     *       400:
     *         description: Bad Request
     *       404:
     *         description: Not Found
     *       500:
     *         description: Internal Server Error
     */
    setPicture: (req, res) => {

        //description: 'Archivo grafico: PNG JPEG GIF' ,

        //recojer fichero de petición
        var file_name = 'Imagen no proporcionada...';
        var id = req.params.id;
        var fieldname = req.params.field;

        // console.log(req.files);

        if (!req.files.picture) {
            return res.status(400).send({
                status: 'error',
                message: 'No hay parametro: logo',
                file_name
            });
        }

        if (!id || !fieldname) {
          return res.status(400).send({
            status: "error",
            message: "Parámetros de ruta, son incorrectos",
          });
        }


        //TODO: Revisar y controlar los campos válidos para imagenes de la colección
        var validFields = ["picture"];

        if (!(fieldname in validFields)) {
          return res.status(400).send({
            status: "error",
            message: "Parámetros de ruta, son incorrectos"
          });
        }

        //conseguir nombre y extensión del archivo
        var file_path = req.files.picture.path;

        var file_name = path.basename(file_path);

        var file_ext = path.extname(file_name).toLowerCase();
        var oldValue = "";

        const validExtensions = ['.png','.jpg', '.jpeg', '.webp', '.gif'];
        if (validExtensions.includes(file_ext)) 
          {
            //Archivo aceptable

            var query = { _id: { $eq: id } };
            // licenseCard | insuranceCard

            var command = { $set: { [fieldname]: file_name } };

            vehicle.findOne(query, (err, doc) => {
                if (err)
                  return res.status(500).send({
                    status: "error",
                    message: err.message,
                  });
                if (doc) {
                  var object = JSON.parse(JSON.stringify(doc._doc));
                  oldvalue = object[fieldname];
                  oldvalue = "/uploads/picture/" + oldvalue;
                  console.log(`Deleting: ${oldvalue}`);
                  fs.unlinkSync(oldvalue);
                 }});
         vehicle.findOneAndUpdate(
            query,
            command,
            { new: true },
            (err, updatedObject) => {
              if (err) {
                fs.unlinkSync(file_path);

                return res.status(500).send({
                  status: "error",
                  message: err.message,
                });
              }

              if (!updatedObject) {
                fs.unlinkSync(file_path);

                return res.status(404).send({
                  status: "error",
                  message: "No se pudo encontrar el registro",
                });
              }

              return res.status(200).send({
                status: "ok",
                updated: updatedObject,
              });
            }
          );
        } else {
          //Archivo no aceptado

          //Borrar el archivo

          fs.unlinkSync(file_path);

          return res.status(400).send({
            status: "error",
            message: "Tipo de archivo no es imagen",
            file_name,
          });
        }
    },


    /**
     * @openapi
     * /api/vehicle/picture/{filename}:
     *   get:
     *     tags: 
     *       - Vehicle
     *     summary: GET VEHICLE PICTURE BY FILENAME
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


       var file = req.params.filename;
       if (validator.isEmpty(file)) {
           return (res.status(400).send({
               status: "error",
               message: "falta el nombre del archivo"
           }));
       }

       var path_file = './uploads/pictures/' + file;

       fs.stat(path_file, (err) => {

           if (err) {

               return res.status(404).send({
                   status: 'error',
                   message: 'archivo no encontrado',
                   path: path_file
               });
           }

           return res.status(200).sendFile(path.resolve(path_file));

       });


    }

}

module.exports = vehicleController;