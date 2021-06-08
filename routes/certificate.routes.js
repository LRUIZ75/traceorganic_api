// Last Updated: 08/06/2021 12:56:40 a. m.
// Updated By  : Luis Danilo Ruiz Tórrez
'use strict'

var express = require('express');
const { verify } = require('../middleware/access.middleware');

var certificateController = require('../controllers/certificate.controller');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_uploadpictures = multipart({uploadDir: './uploads/logo/'});

/* 
C for Create: HTTP POST
R for Read: HTTP GET
U for Update: HTTP PUT
D for Delete: HTTP DELETE 
*/


// CERTIFICATE
router.post('/certificate',  verify(), certificateController.addCertificate); //CREATE CERTIFICATE

router.put('/certificate/:field/:id', [ verify(), md_uploadpictures], certificateController.setPicture); //UPDATE CERTIFICATE IMAGE 
router.put('/certificate/:id',  verify(), certificateController.editCertificate); //UPDATE CERTIFICATE

router.get('/certificate/:id?',  verify(),certificateController.getCertificate); //RETRIEVE CERTIFICATE
router.get('/certificate/images/:filename', certificateController.getPicture); //RETRIEVE CERTIFICATE IMAGE 

router.delete('/certificate/:id',  verify(), certificateController.deleteCertificate); //DELETE CERTIFICATE


module.exports = router;