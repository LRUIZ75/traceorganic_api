// Last Updated: 07/05/2021 03:37:58 p. m.
// Updated By  : @YourName
'use strict'

var express = require('express');
const { verify } = require('../middleware/access.middleware');

var roleController = require('../controllers/role.controller');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_uploadpictures = multipart({uploadDir: './uploads/logos/'});

/* 
C for Create: HTTP POST
R for Read: HTTP GET
U for Update: HTTP PUT
D for Delete: HTTP DELETE 
*/



// ROLE
router.post('/role',  verify(), roleController.addRole); //CREATE


router.put('/role/:id',  verify(), roleController.editRole); //UPDATE

router.get('/role/:id?',  verify(),roleController.getRole); //RETRIEVE
router.get('/role',  verify(), roleController.getRole); //RETRIEVE


router.delete('/role/:id',  verify(), roleController.deleteRole); //DELETE


module.exports = router;