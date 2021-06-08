// Last Updated: 08/06/2021 12:15:44 a. m.
// Updated By  : Luis Danilo Ruiz Tórrez
'use strict'

var express = require('express');
const { verify } = require('../middleware/access.middleware');

var certifierController = require('../controllers/certifier.controller');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_uploadpictures = multipart({uploadDir: './uploads/logo/'});

/* 
C for Create: HTTP POST
R for Read: HTTP GET
U for Update: HTTP PUT
D for Delete: HTTP DELETE 
*/


// CERTIFIER
router.post('/certifier',  verify(), certifierController.addCertifier); //CREATE CERTIFIER

router.put('/certifier/:field/:id', [ verify(), md_uploadpictures], certifierController.setPicture); //UPDATE CERTIFIER IMAGE 
router.put('/certifier/:id',  verify(), certifierController.editCertifier); //UPDATE CERTIFIER

router.get('/certifier/:id?',  verify(),certifierController.getCertifier); //RETRIEVE CERTIFIER
router.get('/certifier/images/:filename', certifierController.getPicture); //RETRIEVE CERTIFIER IMAGE 

router.delete('/certifier/:id',  verify(), certifierController.deleteCertifier); //DELETE CERTIFIER


module.exports = router;