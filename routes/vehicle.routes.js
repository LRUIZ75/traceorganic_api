// Last Updated: 07/05/2021 04:55:00 p. m.
// Updated By  : @YourName
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
router.post('/vehicle',  verify(), vehicleController.addVehicle); //CREATE

router.put('/vehicle/:field/:id', [ verify(), md_uploadpictures], vehicleController.setPicture); //UPDATE IMAGE 
router.put('/vehicle/:id',  verify(), vehicleController.editVehicle); //UPDATE

router.get('/vehicle/:id?',  verify(),vehicleController.getVehicle); //RETRIEVE
router.get('/vehicle',  verify(), vehicleController.getVehicle); //RETRIEVE
router.get('/vehicle/picture/:filename', vehicleController.getPicture); //RETRIEVE IMAGE 

router.delete('/vehicle/:id',  verify(), vehicleController.deleteVehicle); //DELETE


module.exports = router;