// Last Updated: 26/05/2021 02:23:33 p. m.
// Updated By  : Luis Danilo Ruiz Tórrez
'use strict'

var express = require('express');
const { verify } = require('../middleware/access.middleware');

var companyController = require('../controllers/company.controller');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_uploadpictures = multipart({uploadDir: './uploads/logo/'});

/* 
C for Create: HTTP POST
R for Read: HTTP GET
U for Update: HTTP PUT
D for Delete: HTTP DELETE 
*/


// COMPANY
router.post('/company',  verify(), companyController.addCompany); //CREATE COMPANY

router.put('/company/:field/:id', [ verify(), md_uploadpictures], companyController.setPicture); //UPDATE COMPANY IMAGE 
router.put('/company/:id',  verify(), companyController.editCompany); //UPDATE COMPANY

router.get('/company/:id?',  verify(),companyController.getCompany); //RETRIEVE COMPANY
router.get('/company/images/:filename', companyController.getPicture); //RETRIEVE COMPANY IMAGE 

router.delete('/company/:id',  verify(), companyController.deleteCompany); //DELETE COMPANY

router.get('/csv/company',  verify(),companyController.getCompanyCSV); //RETRIEVE COMPANY CSV DATA

module.exports = router;