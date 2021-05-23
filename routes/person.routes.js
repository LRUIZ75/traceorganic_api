// Last Updated: 20/05/2021 07:49:53 a. m.
// Updated By  : @YourName
'use strict'

var express = require('express');
const { verify } = require('../middleware/access.middleware');

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
router.post('/person',  verify(), personController.addPerson); //CREATE

router.put('/person/:field/:id', [ verify(), md_uploadpictures], personController.setPicture); //UPDATE IMAGE 
router.put('/person/:id',  verify(), personController.editPerson); //UPDATE

router.get('/person/:id?',  verify(),personController.getPerson); //RETRIEVE
//router.get('/person',  verify(), personController.getPerson); //RETRIEVE
router.get('/person/picture/:filename', personController.getPicture); //RETRIEVE IMAGE 

router.delete('/person/:id',  verify(), personController.deletePerson); //DELETE


module.exports = router;