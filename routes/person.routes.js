// Last Updated: 05/05/2021 12:47:00 a. m.
// Updated By  : @YourName
'use strict'

var express = require('express');

var personController = require('../controllers/person.controller');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_uploadpictures = multipart({uploadDir: './uploads/pictures/'});

/* 
C for Create: HTTP POST
R for Read: HTTP GET
U for Update: HTTP PUT
D for Delete: HTTP DELETE 
*/



// PERSON
router.post('/person',  personController.addPerson); //CREATE

router.put('/person/:field/:id', [ md_uploadpictures], personController.setPicture); //UPDATE IMAGE 
router.put('/person/:id',  personController.editPerson); //UPDATE

router.get('/person/:id?', personController.getPerson); //RETRIEVE
router.get('/person',  personController.getPerson); //RETRIEVE
router.get('/person/picture/:filename', personController.getPicture); //RETRIEVE IMAGE 

router.delete('/person/:id',  personController.deletePerson); //DELETE


module.exports = router;