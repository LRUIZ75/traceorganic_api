// Last Updated: 14/05/2021 12:40:31 a. m.
// Updated By  : LRUIZ
'use strict'

var express = require('express');
const { verify } = require('../middleware/access.middleware');

var countryController = require('../controllers/country.controller');

var router = express.Router();

var multipart = require('connect-multiparty');


/* 
C for Create: HTTP POST
R for Read: HTTP GET
U for Update: HTTP PUT
D for Delete: HTTP DELETE 
*/



// COUNTRY


router.get('/country/:cca3?' ,countryController.getCountry); //RETRIEVE

module.exports = router;