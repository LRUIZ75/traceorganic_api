// Last Updated: 14/05/2021 12:40:31 a. m.
// Updated By  : LRUIZ
'use strict'

var express = require('express');
const { verify } = require('../middleware/access.middleware');

var companyController = require('../controllers/company.controller');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_uploadpictures = multipart({uploadDir: './uploads/logos/'});

/* 
C for Create: HTTP POST
R for Read: HTTP GET
U for Update: HTTP PUT
D for Delete: HTTP DELETE 
*/



// COMPANY
router.post('/company',  verify(), companyController.addCompany); //CREATE

router.put('/company/:field/:id', [ verify(), md_uploadpictures], companyController.setPicture); //UPDATE IMAGE 
router.put('/company/:id',  verify(), companyController.editCompany); //UPDATE

router.get('/company/:id?',  verify(),companyController.getCompany); //RETRIEVE
//router.get('/company',  verify(), companyController.getCompany); //RETRIEVE
router.get('/company/picture/:filename', companyController.getPicture); //RETRIEVE IMAGE 

router.delete('/company/:id',  verify(), companyController.deleteCompany); //DELETE


module.exports = router;