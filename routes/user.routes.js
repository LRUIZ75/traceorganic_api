// Last Updated: 07/05/2021 05:00:22 p. m.
// Updated By  : @YourName
'use strict'

var express = require('express');
const { verify } = require('../middleware/access.middleware');

var userController = require('../controllers/user.controller');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_uploadpictures = multipart({uploadDir: './uploads/pictures/'});

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
router.get('/user',  verify(), userController.getUser); //RETRIEVE


router.delete('/user/:id',  verify(), userController.deleteUser); //DELETE


module.exports = router;