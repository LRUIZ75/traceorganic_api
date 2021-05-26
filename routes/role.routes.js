// Last Updated: 26/05/2021 03:12:30 p. m.
// Updated By  : Luis Danilo Ruiz Tórrez
'use strict'

var express = require('express');
const { verify } = require('../middleware/access.middleware');

var roleController = require('../controllers/role.controller');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_uploadpictures = multipart({uploadDir: './uploads/picture/'});

/* 
C for Create: HTTP POST
R for Read: HTTP GET
U for Update: HTTP PUT
D for Delete: HTTP DELETE 
*/


// ROLE
router.post('/role',  verify(), roleController.addRole); //CREATE ROLE


router.put('/role/:id',  verify(), roleController.editRole); //UPDATE ROLE

router.get('/role/:id?',  verify(),roleController.getRole); //RETRIEVE ROLE


router.delete('/role/:id',  verify(), roleController.deleteRole); //DELETE ROLE


module.exports = router;