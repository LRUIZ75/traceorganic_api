// Last Updated: 08/06/2021 10:16:20 p. m.
// Updated By  : Luis Danilo Ruiz Tórrez
'use strict'

var express = require('express');
const { verify } = require('../middleware/access.middleware');

var farmerController = require('../controllers/farmer.controller');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_uploadpictures = multipart({uploadDir: './uploads/pictures/'});

/* 
C for Create: HTTP POST
R for Read: HTTP GET
U for Update: HTTP PUT
D for Delete: HTTP DELETE 
*/


// FARMER
router.post('/farmer',  verify(), farmerController.addFarmer); //CREATE FARMER


router.put('/farmer/:id',  verify(), farmerController.editFarmer); //UPDATE FARMER

router.get('/farmer/:id?',  verify(),farmerController.getFarmer); //RETRIEVE FARMER

router.get('/csv/farmer',  verify(),farmerController.getFarmerCSV); //RETRIEVE FARMER CSV DATA 

router.delete('/farmer/:id',  verify(), farmerController.deleteFarmer); //DELETE FARMER


module.exports = router;