// Last Updated: 07/06/2021 01:24:29 a. m.
// Updated By  : Luis Danilo Ruiz Tórrez
'use strict'

var express = require('express');
const { verify } = require('../middleware/access.middleware');

var processingcentersController = require('../controllers/processingcenters.controller');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_uploadpictures = multipart({uploadDir: './uploads/pictures/'});

/* 
C for Create: HTTP POST
R for Read: HTTP GET
U for Update: HTTP PUT
D for Delete: HTTP DELETE 
*/


// PROCESSINGCENTERS
router.post('/processingcenters',  verify(), processingcentersController.addProcessingCenters); //CREATE PROCESSINGCENTERS

router.put('/processingcenters/:field/:id', [ verify(), md_uploadpictures], processingcentersController.setPicture); //UPDATE PROCESSINGCENTERS IMAGE 
router.put('/processingcenters/:id',  verify(), processingcentersController.editProcessingCenters); //UPDATE PROCESSINGCENTERS

router.get('/processingcenters/:id?',  verify(),processingcentersController.getProcessingCenters); //RETRIEVE PROCESSINGCENTERS
router.get('/processingcenters/images/:filename', processingcentersController.getPicture); //RETRIEVE PROCESSINGCENTERS IMAGE 

router.delete('/processingcenters/:id',  verify(), processingcentersController.deleteProcessingCenters); //DELETE PROCESSINGCENTERS


module.exports = router;