// Last Updated: 08/06/2021 10:16:20 p. m.
// Updated By  : Luis Danilo Ruiz Tórrez
'use strict'

const farmerModel = require('../models/farmer.model');
const validator = require('validator');
const fs = require('fs');
const path = require('path');
const { ObjectId } = require('mongodb');
const { findOneAndDelete } = require('../models/farmer.model');
const  MSG  = require("../modules/message.module");
const Log = require("cabin");
const jsonexport = require("jsonexport");
const securable = require("../modules/security.module");


/**
 * @swagger
 * tags:
 *   name: Farmer
 *   description: Farmer Data
 */

var farmerController = {

    /**
     * @openapi
     * /api/farmer/{id}:
     *   get:
     *     tags: 
     *       - Farmer
     *     summary: GET ONE FARMER BY ID 
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         description: Farmer ID
     *         required: false
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/Farmer"
     *       404:
     *         description: Not Found
     *       500:
     *         description: Internal Server Error
     */

    /**
     * @openapi
     * /api/farmer:
     *   get:
     *     tags: 
     *       - Farmer
     *     summary: GET ALL FARMER
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
     *                 $ref: "#/components/schemas/Farmer"
     *       404:
     *         description: Not Found
     *       500:
     *         description: Internal Server Error
     */

    getFarmer: async (req, res) => {

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

        farmerModel.find()
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
                    links: [ process.env.API_URL + "doc/#/Farmer/post_api_farmer" ]    
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
     * /api/csv/farmer:
     *   get:
     *     tags:
     *       - Farmer
     *     summary: GET ALL FARMER AS CSV 
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
     *                 $ref: "#/components/schemas/Farmer"
     *       401:
     *         description: Not Authorized
     *       404:
     *         description: Not Found
     *       500:
     *         description: Internal Server Error
     */

   getFarmerCSV: async (req, res) => {

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

    
    farmerModel.find()
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
          links: [ process.env.API_URL + "doc/#/Farmer/post_api_farmer" ]   
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
     * /api/farmer:
     *   post:
     *     tags: 
     *       - Farmer
     *     summary: ADD NEW FARMER
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       required: true
     *       content: 
     *         application/json:
     *           schema:
     *             $ref: "#/components/schemas/Farmer"
     *     responses:
     *       201:
     *         description: Created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/Farmer"
     *       400:
     *         description: Bad Request
     *       500:
     *         description: Internal Server Error
     */
    addFarmer: (req, res) => {


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


        var newFarmer = new farmerModel(data);



        //INTENTAR GUARDAR EL NUEVO OBJETO
        newFarmer.save((err, storedObject) => {
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
     * /api/farmer/{id}:
     *   put:
     *     tags: 
     *       - Farmer
     *     summary: UPDATE ONE FARMER BY ID
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         description: "Farmer ID"
     *         type: string
     *         required: true
     *     requestBody:
     *       required: true
     *       content: 
     *         application/json:
     *           schema:
     *             $ref: "#/components/schemas/Farmer"
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/Farmer"
     *       400:
     *         description: Bad Request
     *       404:
     *         description: Not Found
     *       500:
     *         description: Internal Server Error
     */
    editFarmer: (req, res) => {

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

        farmerModel.findOneAndUpdate(query, command, { new: true }, (err, updatedObject) => {
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
     * /api/farmer/{id}:
     *   delete:
     *     tags: 
     *       - Farmer
     *     summary: DELETE ONE FARMER BY ID
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         description: "Farmer ID"
     *         type: string
     *         required: true
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/Farmer"
     *       400:
     *         description: Bad Request
     *       404:
     *         description: Not Found
     *       500:
     *         description: Internal Server Error
     */
    deleteFarmer: (req, res) => {

        var payload = req.payload;
        


        var id = req.params.id;
        if (!id || id == undefined) {
            return (res.status(400).send({
                status: "error",
                message: MSG["NO-PARAM"]
            }));
        }

        var query = { '_id': { $eq: id } };

        farmerModel.findOneAndDelete(query, { new: false }, (err, deletedObject) => {
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
    

}

module.exports = farmerController;