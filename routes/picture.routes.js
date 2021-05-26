// Last Updated: 26/05/2021 03:00:23 p. m.
// Updated By  : Luis Danilo Ruiz Tórrez
'use strict'

var express = require('express');
const { verify } = require('../middleware/access.middleware');

var personController = require('../controllers/person.controller');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_uploadpictures = multipart({uploadDir: './uploads/picture/'});

/* 
C for Create: HTTP POST
R for Read: HTTP GET
U for Update: HTTP PUT
D for Delete: HTTP DELETE 
*/


// PERSON
router.post('/person',  verify(), personController.addPerson); //CREATE PERSON

router.put('/person/:field/:id', [ verify(), md_uploadpictures], personController.setPicture); //UPDATE PERSON IMAGE 
router.put('/person/:id',  verify(), personController.editPerson); //UPDATE PERSON

router.get('/person/:id?',  verify(),personController.getPerson); //RETRIEVE PERSON
router.get('/person/images/:filename', personController.getPicture); //RETRIEVE PERSON IMAGE 

router.delete('/person/:id',  verify(), personController.deletePerson); //DELETE PERSON


module.exports = router;