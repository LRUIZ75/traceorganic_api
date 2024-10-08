﻿// Last Updated: 08/06/2021 09:59:40 p. m.
// Updated By  : Luis Danilo Ruiz Tórrez
'use strict'

const vehicleModel = require('../models/vehicle.model');
const validator = require('validator');
const fs = require('fs');
const path = require('path');
const { ObjectId } = require('mongodb');
const { findOneAndDelete } = require('../models/vehicle.model');
const  MSG  = require("../modules/message.module");
const Log = require("cabin");
const jsonexport = require("jsonexport");
const securable = require("../modules/security.module");


/**
 * @swagger
 * tags:
 *   name: Vehicle
 *   description: Vehicle Data
 */

var vehicleController = {

    /**
     * @openapi
     * /api/vehicle/{id}:
     *   get:
     *     tags: 
     *       - Vehicle
     *     summary: GET ONE VEHICLE BY ID 
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         description: Vehicle ID
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
     *                 $ref: "#/components/schemas/Vehicle"
     *       404:
     *         description: Not Found
     *       500:
     *         description: Internal Server Error
     */

    getVehicle: async (req, res) => {

        var id = req.params.id;
        
        var payload = req.payload;
        
        var isSuper = await securable.hasRole("superadmin", payload.roles);
        /*var isData =  await securable.hasRole("dataretriever", payload.roles);
        
        if (!(isSuper || isData)) {
          return res.status(401).send({
            status: "error",
            message: MSG["NO-PERM"],
          });
        }*/

        var filterByCompany = {};
        if(!isSuper){ //TODO: Usar el campo correspondiente de compañía
          filterByCompany = { company: { $eq: payload.company} };}

        console.log(filterByCompany);

        var query = { '_id': { $eq: id } };

        if (!id || id === undefined) query = {};
        else query = { '_id': { $eq: id } };

        console.log(query);

        vehicleModel.find()
        .where(filterByCompany)
        .where(query)
        .populate("company")
        .populate("owner")
        .exec((err, objects) => {


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
                    links: [ process.env.API_URL + "doc/#/Vehicle/post_api_vehicle" ]    
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
     * /api/csv/vehicle:
     *   get:
     *     tags:
     *       - Vehicle
     *     summary: GET ALL VEHICLE AS CSV 
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
     *                 $ref: "#/components/schemas/Vehicle"
     *       401:
     *         description: Not Authorized
     *       404:
     *         description: Not Found
     *       500:
     *         description: Internal Server Error
     */

   getVehicleCSV: async (req, res) => {

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
    if(isData){ //TODO: Usar el campo correspondiente de compañía
      filterByCompany = { company: { $eq: payload.company} };}

    console.log(filterByCompany);

    
    vehicleModel.find()
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
          links: [ process.env.API_URL + "doc/#/Vehicle/post_api_vehicle" ]   
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
     * /api/vehicle:
     *   post:
     *     tags: 
     *       - Vehicle
     *     summary: ADD NEW VEHICLE
     *     security:
     *       - BearerAuth: []
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

        var payload = req.payload;
        


        //SIN PARAMETROS
        if (!data) {

            return (res.status(400).send({
                status: "error",
                message: MSG["NO-BODY"]
            })
            );
        }


        var newVehicle = new vehicleModel(data);



        //INTENTAR GUARDAR EL NUEVO OBJETO
        newVehicle.save((err, storedObject) => {
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
     * /api/vehicle/{id}:
     *   put:
     *     tags: 
     *       - Vehicle
     *     summary: UPDATE ONE VEHICLE BY ID
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         description: "Vehicle ID"
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
        
        var payload = req.payload;
        


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

        vehicleModel.findOneAndUpdate(query, command, { new: true }, (err, updatedObject) => {
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
     * /api/vehicle/{id}:
     *   delete:
     *     tags: 
     *       - Vehicle
     *     summary: DELETE ONE VEHICLE BY ID
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         description: "Vehicle ID"
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

        var payload = req.payload;
        


        var id = req.params.id;
        if (!id || id == undefined) {
            return (res.status(400).send({
                status: "error",
                message: MSG["NO-PARAM"]
            }));
        }

        var query = { '_id': { $eq: id } };

        vehicleModel.findOneAndDelete(query, { new: false }, (err, deletedObject) => {
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
     * /api/vehicle/{field}/{id}:
     *   put:
     *     tags: 
     *       - Vehicle
     *     summary: UPLOAD VEHICLE IMAGE BY FIELDNAME AND ID
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
     *         default: "registration | insurance | picture"
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
     *       415:
     *         description: Unsupported Media Type
     *       500:
     *         description: Internal Server Error
     */
    setPicture: (req, res) => {

        //description: 'Archivo grafico: PNG JPEG GIF' ,

        var payload = req.payload;
        

            
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
        var validFields = ["registration","insurance","picture"];

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

            vehicleModel.findOne(query, (err, doc) => {
                if (err)
                  return res.status(500).send({
                    status: "error",
                    message: MSG["500"] + err.message
                  });
                if (doc) {
                      var object = JSON.parse(JSON.stringify(doc._doc));
                      let oldvalue = "./uploads/pictures/" + object[fieldname];

                      console.log(`Deleting: ${oldvalue}`);
                      if (fs.existsSync(oldvalue)) fs.unlinkSync(oldvalue);              
                 }});
                 
         vehicleModel.findOneAndUpdate(
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
     * /api/vehicle/images/{filename}:
     *   get:
     *     tags: 
     *       - Vehicle
     *     summary: GET VEHICLE IMAGE BY FILENAME
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
        


       var file = req.params.filename;
       if (validator.isEmpty(file)) {
           return (res.status(400).send({
               status: "error",
               message: MSG["NO-PARAM"]
           }));
       }

       var path_file = './uploads/pictures/' + file;

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

module.exports = vehicleController;