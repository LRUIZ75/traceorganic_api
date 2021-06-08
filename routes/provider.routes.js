// Last Updated: 07/06/2021 08:53:39 p. m.
// Updated By  : Luis Danilo Ruiz Tórrez
'use strict'

var express = require('express');
const { verify } = require('../middleware/access.middleware');

var providerController = require('../controllers/provider.controller');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_uploadpictures = multipart({uploadDir: './uploads/pictures/'});

/* 
C for Create: HTTP POST
R for Read: HTTP GET
U for Update: HTTP PUT
D for Delete: HTTP DELETE 
*/


// PROVIDER
router.post('/provider',  verify(), providerController.addProvider); //CREATE PROVIDER

router.put('/provider/:field/:id', [ verify(), md_uploadpictures], providerController.setPicture); //UPDATE PROVIDER IMAGE 
router.put('/provider/:id',  verify(), providerController.editProvider); //UPDATE PROVIDER

router.get('/provider/:id?',  verify(),providerController.getProvider); //RETRIEVE PROVIDER
router.get('/provider/images/:filename', providerController.getPicture); //RETRIEVE PROVIDER IMAGE 

router.delete('/provider/:id',  verify(), providerController.deleteProvider); //DELETE PROVIDER


module.exports = router;