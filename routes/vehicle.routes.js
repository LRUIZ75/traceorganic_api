// Last Updated: 08/06/2021 09:59:40 p. m.
// Updated By  : Luis Danilo Ruiz Tórrez
'use strict'

var express = require('express');
const { verify } = require('../middleware/access.middleware');

var vehicleController = require('../controllers/vehicle.controller');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_uploadpictures = multipart({uploadDir: './uploads/pictures/'});

/* 
C for Create: HTTP POST
R for Read: HTTP GET
U for Update: HTTP PUT
D for Delete: HTTP DELETE 
*/


// VEHICLE
router.post('/vehicle',  verify(), vehicleController.addVehicle); //CREATE VEHICLE

router.put('/vehicle/:field/:id', [ verify(), md_uploadpictures], vehicleController.setPicture); //UPDATE VEHICLE IMAGE 
router.put('/vehicle/:id',  verify(), vehicleController.editVehicle); //UPDATE VEHICLE

router.get('/vehicle/:id?',  verify(),vehicleController.getVehicle); //RETRIEVE VEHICLE
router.get('/vehicle/images/:filename', vehicleController.getPicture); //RETRIEVE VEHICLE IMAGE 
router.get('/csv/vehicle',  verify(),vehicleController.getVehicleCSV); //RETRIEVE VEHICLE CSV DATA 

router.delete('/vehicle/:id',  verify(), vehicleController.deleteVehicle); //DELETE VEHICLE


module.exports = router;