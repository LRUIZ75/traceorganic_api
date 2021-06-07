// Last Updated: 07/06/2021 02:42:00 a. m.
// Updated By  : Luis Danilo Ruiz Tórrez
'use strict'

var express = require('express');
const { verify } = require('../middleware/access.middleware');

var processingcenterController = require('../controllers/processingcenter.controller');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_uploadpictures = multipart({uploadDir: './uploads/pictures/'});

/* 
C for Create: HTTP POST
R for Read: HTTP GET
U for Update: HTTP PUT
D for Delete: HTTP DELETE 
*/


// PROCESSINGCENTER
router.post('/processingcenter',  verify(), processingcenterController.addProcessingCenter); //CREATE PROCESSINGCENTER

router.put('/processingcenter/:field/:id', [ verify(), md_uploadpictures], processingcenterController.setPicture); //UPDATE PROCESSINGCENTER IMAGE 
router.put('/processingcenter/:id',  verify(), processingcenterController.editProcessingCenter); //UPDATE PROCESSINGCENTER

router.get('/processingcenter/:id?',  verify(),processingcenterController.getProcessingCenter); //RETRIEVE PROCESSINGCENTER
router.get('/processingcenter/images/:filename', processingcenterController.getPicture); //RETRIEVE PROCESSINGCENTER IMAGE 

router.delete('/processingcenter/:id',  verify(), processingcenterController.deleteProcessingCenter); //DELETE PROCESSINGCENTER


module.exports = router;