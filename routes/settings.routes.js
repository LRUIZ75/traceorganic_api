// Last Updated: 07/06/2021 01:05:14 a. m.
// Updated By  : Luis Danilo Ruiz Tórrez
'use strict'

var express = require('express');
const { verify } = require('../middleware/access.middleware');

var settingsController = require('../controllers/settings.controller');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_uploadpictures = multipart({uploadDir: './uploads/picture/'});

/* 
C for Create: HTTP POST
R for Read: HTTP GET
U for Update: HTTP PUT
D for Delete: HTTP DELETE 
*/


// SETTINGS
router.post('/settings',  verify(), settingsController.addSettings); //CREATE SETTINGS


router.put('/settings/:id',  verify(), settingsController.editSettings); //UPDATE SETTINGS

router.get('/settings/:id?',  verify(),settingsController.getSettings); //RETRIEVE SETTINGS


router.delete('/settings/:id',  verify(), settingsController.deleteSettings); //DELETE SETTINGS


module.exports = router;