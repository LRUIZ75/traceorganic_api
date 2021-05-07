'use strict'

var express = require('express');

const { verify } = require('../middelware/access.middleware');

const passport = require('passport');


const authController = require('../controllers/auth.controller');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_uploadlogos = multipart({uploadDir: './uploads/logos'});
var md_uploadpictures = multipart({uploadDir: './uploads/pictures'});

/* 
C for Create: HTTP POST
R for Read: HTTP GET
U for Update: HTTP PUT
D for Delete: HTTP DELETE 
*/

//AUTHENTICATION

router.post('/login',authController.login); //POST



module.exports = router;