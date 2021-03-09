

'use strict'

const os = require('os');
const generalsettingModel = require('../models/generalsetting.model');
const validator = require('validator');
const fs = require('fs');
const path = require('path');
const { ObjectId } = require('mongodb');
const { findOneAndDelete } = require('../models/generalsetting.model');


/**
 * @swagger
 * tags:
 *   name: GeneralSetting
 *   description: a General Setting
 */

var generalsettingController = {

    /**
     * @openapi
     * /api/generalsetting/{id}:
     *   get:
     *     tags: 
     *       - GeneralSetting
     *     description: Get a General Setting by Id
     *     security:
     *       - ApiKeyAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         description: Object Id
     *         required: false
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/GeneralSetting"
     *       404:
     *         description: Not Found
     *       500:
     *         description: Internal Server Error
     */

    /**
     * @openapi
     * /api/generalsetting:
     *   get:
     *     tags: 
     *       - GeneralSetting
     *     description: Get list of a General Setting
     *     security:
     *       - ApiKeyAuth: []
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: "#/components/schemas/GeneralSetting"
     *       404:
     *         description: Not Found
     *       500:
     *         description: Internal Server Error
     */

    getGeneralSetting: (req, res) => {

        var id = req.params.id;

        var query = { '_id': { $eq: id } };

        if (!id || id === undefined) query = {};
        else query = { '_id': { $eq: id } };

        console.log(query);

        generalsettingModel.find(query, (err, objects) => {


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
                    links: [{ "Agregar registro => curl -X POST ": global.baseURL + "/api/generalsetting" }]
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
     * /api/generalsetting:
     *   post:
     *     tags: 
     *       - GeneralSetting
     *     description: Create a General Setting
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: body
     *         required: true
     *         schema:
     *           $ref: "#/components/schemas/GeneralSetting"
     *     responses:
     *       201:
     *         description: Created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/GeneralSetting"
     *       400:
     *         description: Bad Request
     *       500:
     *         description: Internal Server Error
     */
    addGeneralSetting: (req, res) => {


        var data = req.body;


        //SIN PARAMETROS
        if (!data) {

            return (res.status(400).send({
                status: "error",
                messager: "Faltan parámetros de request en formato JSON"
            })
            );
        }


        var newGeneralSetting = new generalsettingModel(data);



        //INTENTAR GUARDAR EL NUEVO OBJETO
        newGeneralSetting.save((err, storedObject) => {
            if (err) {
                return (res.status(500).send({
                    status: "error",
                    error: err.message
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
     * /api/generalsetting/{id}:
     *   put:
     *     tags: 
     *       - GeneralSetting
     *     description: Update a General Setting
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         description: "Object Id"
     *         type: string
     *         required: true
     *       - in: body
     *         required: true
     *         schema:
     *           $ref: "#/components/schemas/GeneralSetting"
     *     responses:
     *       200:
     *         description: Ok
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/GeneralSetting"
     *       400:
     *         description: Bad Request
     *       404:
     *         description: Not Found
     *       500:
     *         description: Internal Server Error
     */
    editGeneralSetting: (req, res) => {

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

        generalsettingModel.findOneAndUpdate(query, command, { new: true }, (err, updatedObject) => {
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

            return (res.status(200).send({
                status: "ok",
                updated: updatedObject
            }));

        });

    },

    /**
     * @openapi
     * /api/generalsetting/{id}:
     *   delete:
     *     tags: 
     *       - GeneralSetting
     *     description: Delete a General Setting by id
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         description: "Object Id"
     *         type: string
     *         required: true
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/GeneralSetting"
     *       400:
     *         description: Bad Request
     *       404:
     *         description: Not Found
     *       500:
     *         description: Internal Server Error
     */
    deleteGeneralSetting: (req, res) => {


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

            return (res.status(200).send({
                status: "ok",
                deleted: deletedObject
            }));

        });
    },
    

    /**
     * @openapi
     * /api/generalsetting/logo/{id}:
     *   put:
     *     tags: 
     *       - GeneralSetting
     *     description: Upload a General Setting logo
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         description: "Object Id"
     *         type: string
     *         required: true
     *       - in: form-data
     *         name: logo
     *         required: true
     *         content:
     *           file:
     *             schema:
     *               type: string
     *               format: base64
     *     responses:
     *       200:
     *         description: Ok
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/GeneralSetting"
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

        // console.log(req.files);

        if (!req.files.picture) {
            return res.status(400).send({
                status: 'error',
                message: 'No hay parametro: logo',
                file_name
            });
        }
        if (!id) {

            return res.status(400).send({
                status: 'error',
                message: 'No hay parámetro: Id'
            });
        }

        //conseguir nombre y extensión del archivo
        var file_path = req.files.picture.path;

        var file_name = path.basename(file_path);

        var file_ext = path.extname(file_name);


        console.log(file_ext);

        switch (file_ext) {
            case '.png':
            case '.jpg':
            case '.jpeg':
            case '.gif':
                //Archivo aceptable


                var query = { '_id': { $eq: id } };
                var command = { $set: { 'logo': file_name } };


                generalsettingModel.findOneAndUpdate(query, command, { new: true }, (err, updatedObject) => {

                    if (err) {

                        fs.unlinkSync(file_path);

                        return res.status(500).send({
                            status: 'error',
                            error: err
                        });
                    }

                    if (!updatedObject) {

                        fs.unlinkSync(file_path);

                        return res.status(404).send({
                            status: 'error',
                            message: 'No se pudo encontrar el registro'
                        });
                    }

                    return res.status(200).send({
                        status: 'ok',
                        updated: updatedObject
                    });
                });
                break;

            default:
                //Archivo no aceptado

                //Borrar el archivo

                fs.unlinkSync(file_path);

                return res.status(400).send({
                    status: 'error',
                    message: 'Tipo de archivo no es imagen',
                    file_name
                }
                );
                break;
        };
    },


    /**
     * @openapi
     * /api/generalsetting/logo/{filename}:
     *   get:
     *     tags: 
     *       - GeneralSetting
     *     description: Get general a General Setting logo by filename
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

       var path_file = './uploads/logos/' + file;

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

module.exports = generalsettingController;