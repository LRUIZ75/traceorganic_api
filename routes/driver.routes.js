
'use strict'

var express = require('express');

const { verify } = require('../middelware/access.middleware');

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
router.post('/driver', verify, driverController.addDriver); //CREATE


router.put('/driver/:id', verify, driverController.editDriver); //UPDATE

router.get('/driver/:id?', verify,driverController.getDriver); //RETRIEVE
router.get('/driver', verify, driverController.getDriver); //RETRIEVE


router.delete('/driver/:id', verify, driverController.deleteDriver); //DELETE


module.exports = router;