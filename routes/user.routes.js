// Last Updated: 14/05/2021 12:49:59 a. m.
// Updated By  : LRUIZ
'use strict'

var express = require('express');
const { verify } = require('../middleware/access.middleware');

var userController = require('../controllers/user.controller');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_uploadpictures = multipart({uploadDir: './uploads/logos/'});

/* 
C for Create: HTTP POST
R for Read: HTTP GET
U for Update: HTTP PUT
D for Delete: HTTP DELETE 
*/



// USER
router.post('/user',  verify(), userController.addUser); //CREATE


router.put('/user/:id',  verify(), userController.editUser); //UPDATE

router.get('/user/:id?',  verify(),userController.getUser); //RETRIEVE
//router.get('/user',  verify(), userController.getUser); //RETRIEVE


router.delete('/user/:id',  verify(), userController.deleteUser); //DELETE


module.exports = router;