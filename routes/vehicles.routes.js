// Last Updated: 07/06/2021 02:02:27 a. m.
// Updated By  : Luis Danilo Ruiz Tórrez
'use strict'

var express = require('express');
const { verify } = require('../middleware/access.middleware');

var vehiclesController = require('../controllers/vehicles.controller');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_uploadpictures = multipart({uploadDir: './uploads/pictures/'});

/* 
C for Create: HTTP POST
R for Read: HTTP GET
U for Update: HTTP PUT
D for Delete: HTTP DELETE 
*/


// VEHICLES
router.post('/vehicles',  verify(), vehiclesController.addVehicles); //CREATE VEHICLES

router.put('/vehicles/:field/:id', [ verify(), md_uploadpictures], vehiclesController.setPicture); //UPDATE VEHICLES IMAGE 
router.put('/vehicles/:id',  verify(), vehiclesController.editVehicles); //UPDATE VEHICLES

router.get('/vehicles/:id?',  verify(),vehiclesController.getVehicles); //RETRIEVE VEHICLES
router.get('/vehicles/images/:filename', vehiclesController.getPicture); //RETRIEVE VEHICLES IMAGE 

router.delete('/vehicles/:id',  verify(), vehiclesController.deleteVehicles); //DELETE VEHICLES


module.exports = router;