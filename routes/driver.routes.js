// Last Updated: 08/06/2021 10:09:38 p. m.
// Updated By  : Luis Danilo Ruiz Tórrez
'use strict'

var express = require('express');
const { verify } = require('../middleware/access.middleware');

var driverController = require('../controllers/driver.controller');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_uploadpictures = multipart({uploadDir: './uploads/pictures/'});

/* 
C for Create: HTTP POST
R for Read: HTTP GET
U for Update: HTTP PUT
D for Delete: HTTP DELETE 
*/


// DRIVER
router.post('/driver',  verify(), driverController.addDriver); //CREATE DRIVER

router.put('/driver/:field/:id', [ verify(), md_uploadpictures], driverController.setPicture); //UPDATE DRIVER IMAGE 
router.put('/driver/:id',  verify(), driverController.editDriver); //UPDATE DRIVER

router.get('/driver/:id?',  verify(),driverController.getDriver); //RETRIEVE DRIVER
router.get('/driver/images/:filename', driverController.getPicture); //RETRIEVE DRIVER IMAGE 
router.get('/csv/driver',  verify(),driverController.getDriverCSV); //RETRIEVE DRIVER CSV DATA 

router.delete('/driver/:id',  verify(), driverController.deleteDriver); //DELETE DRIVER


module.exports = router;