

'use strict'

const os = require('os');
const usersModel = require('../models/users.model');
const validator = require('validator');
const fs = require('fs');
const path = require('path');
const { ObjectId } = require('mongodb');
const { findOneAndDelete } = require('../models/users.model');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');


/**
 * @openapi
 * tags:
 *   name: Users
 *   description: Users and Authentication
 */
var usersController = {

    getUsers: (req, res) => {

        var id = req.params.id;

        var query = { '_id': { $eq: id } };

        if (!id || id === undefined) query = {};
        else query = { '_id': { $eq: id } };

        console.log(query);

        usersModel.find(query, (err, objects) => {


            if (err) {
                return (res.status(500).send({
                    status: "error",
                    error: err.message
                })
                );
            }

            if (!objects || objects.length == 0) {
 
                return (res.status(404).send({
                    status: "error",
                    message: "Registro(s) no encontrado(s)",
                    links: [{ "Agregar registro => curl -X POST ": global.baseURL + "/api/users" }]
                }

                ));
            } else {
                /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/Users" },
               description: '<b>Lista de Objetos</b>' 
                } */

                return (res.status(200).send({
                    status: "ok",
                    objects: objects
                }));
            }
        });
    },

    addUsers: (req, res) => {

        // #swagger.tags = ['User']
        // #swagger.description = 'CREAR UN REGISTRO.'
        // #swagger.schema = { $ref: "#/definitions/Users" }
        var data = req.body;

        /*
            #swagger.parameters['data'] = {
            in: "body",
            name: "data",
            type: "object",
            required: true
          }
        */

        //SIN PARAMETROS
        if (!data) {

            return (res.status(400).send({
                status: "error",
                messager: "Faltan parámetros de request en formato JSON"
            })
            );
        }

        //var parsedJSON = JSON.parse(JSON.stringify(data));
        // console.log(data);
        // console.log(JSON.stringify(data));
        // console.log(parsedJSON);
        // console.log(new personsModel(data));

        var newUsers = new usersModel(data);



        //INTENTAR GUARDAR EL NUEVO OBJETO
        newUsers.save((err, storedObject) => {
            if (err) {
                return (res.status(500).send({
                    status: "error",
                    error: err.message
                }));

            } 

            if (!storedObject) {
                return (res.status(500).send({
                    status: "error",
                    message: "Error al intentar guardar un nuevo registro"
                }));
            }

            /* #swagger.responses[201] = { 
            schema: { $ref: "#/definitions/Users" },
            description: '<b>Creado</b>' 
            } */
            return (res.status(201).send({
                status: "ok",
                created: storedObject
            }));
            

        });
    },

    editUsers: (req, res) => {

        // #swagger.tags = ['User']
        // #swagger.description = 'ACTULIZAR DATOS.'

        /* #swagger.parameters['id'] = {
        description: 'Id del registro en la coleccion' ,
        type: 'string',
        required: true} 
        */
        /*
            #swagger.parameters['data'] = {
            in: "body",
            name: "data",
            type: "object",
            required: true
          }
        */
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

        usersModel.findOneAndUpdate(query, command, { new: true }, (err, updatedObject) => {
            if (err) {
                return (res.status(500).send({
                    status: "error",
                    error: err.message
                }));
            }

            if (!updatedObject) {

                return (res.status(404).send({
                    status: "error",
                    message: "No se encontró el registro a modificar"
                }));
            }
            /* #swagger.responses[200] = { 
           schema: { $ref: "#/definitions/Users" },
           description: '<b>Actualizado</b>' 
            } */
            return (res.status(200).send({
                status: "ok",
                updated: updatedObject
            }));

        });

    },

    deleteUsers: (req, res) => {
        // #swagger.tags = ['User']
        // #swagger.description = 'ELIMINAR DATOS.'

        /* #swagger.parameters['id'] = {
           description: 'Id del registro en la coleccion' ,
           type: 'string',
        required: true} 
        */

        var personId = req.params.id;
        if (!personId || personId == undefined) {
            return (res.status(400).send({
                status: "error",
                message: "falta parámetro requerido ID"
            }));
        }

        var query = { '_id': { $eq: personId } };

        personsModel.findOneAndDelete(query, { new: false }, (err, deletedObject) => {
            if (err) {
                return (res.status(500).send({
                    status: "error",
                    error: err.message
                }));
            }

            if (!deletedObject) {

                return (res.status(404).send({
                    status: "error",
                    message: "No se encontró el registro a eliminar"
                }));
            }

            /* #swagger.responses[200] = { 
           schema: { $ref: "#/definitions/Users" },
           description: '<b>Borrado</b>' 
            } */
            return (res.status(200).send({
                status: "ok",
                deleted: deletedObject
            }));

        });
    },

    /**
    * @openapi
    * /api/login:
    *   post:
    *     tags: 
    *       - Users
    *     description: Login and Authenticate
    *     requestBody:
    *         name: userData
    *         description: 'Object : username and password'
    *         required: true
    *         content: 
    *           application/json:
    *             schema:
    *               properties:
    *                 userName: 
    *                   type: string
    *                   example: 'admin'
    *                 password: 
    *                   type: string
    *                   example: '123Password'
    *     responses:
    *       200:
    *         description: OK
    *         content:
    *           application/json:
    *             schema:
    *               properties:
    *                 status: 
    *                   type: string
    *                   example: 'ok'
    *                 token: 
    *                   type: string
    *                   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImxydWl6NzUiLCJpYXQiOjE2MTQ2NDgzNDEsImV4cCI6MTYxNDY1MTk0MX0.4w78Mk1ztSuBhayQCbPOv-v5xrlscpgoAz9OSo2Cm4'
    *       400:
    *         description: Bad Request
    *       401:
    *         description: Unathorized
    *       500:
    *         description: Internal Server Error
    */
    login: (req, res) => {

        var userData = JSON.parse(JSON.stringify(req.body));
        var userName="";
        var password="";

        if(!userData){
            return (res.status(400).send({
                status: "error",
                message: "Parámetros de llamada no válidos"
            }));
        }

        userName = userData.userName;
        password = userData.password;

        if (!userName || !password) {
            return (res.status(400).send({
                status: "error",
                message: "Parámetros de llamada no válidos"
            }));
        }

        var query = { userName: { $eq: userName } };
        usersModel.findOne(query, (err, userObject) => {
            if (err) {
                return (res.status(500).send({
                    status: "error",
                    error: err.message
                }));
            }

            if (!userObject) {
                return (res.status(401).send({
                    status: "error",
                    message: "No autorizado"
                }));
            }

            if (!bcrypt.compareSync(password, userObject.password)) {
                return (res.status(401).send({
                    status: "error",
                    message: "No autorizado"
                }));
            }

            // Proceder con la autorización, crear el JWT y devolverlo con un codigo
            let payload = { userName: userName };
            let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET,
                {
                    algorithm: "HS256",
                    expiresIn: process.env.ACCESS_TOKEN_LIFE
                });
            
            let refreshToken = jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET, {
                algorithm: "HS256",
                expiresIn: process.env.REFRESH_TOKEN_LIFE
            });

            var command = {$set : {refreshAccessToken: refreshToken }};
            usersModel.findOneAndUpdate(query,command);

            
            return (res.status(200).send({
                status: "ok",
                token: accessToken
            }));

        });
    } 
}

module.exports = usersController;