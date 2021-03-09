'use strict'

var express = require('express');

const { verify } = require('../middelware/access.middleware');


var usersController = require('../controllers/users.controller');

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

//SETTINGS



// USERS
router.post('/users', usersController.addUsers); //CREATE

//router.put('/users/picture/:id', md_uploadpictures, usersController.setPicture); //UPDATE
router.put('/users/:id', usersController.editUsers); //UPDATE

router.get('/users/:id?',usersController.getUsers); //RETRIEVE
router.get('/users',usersController.getUsers); //RETRIEVE
//router.get('/users/picture/:filename',usersController.getPicture); //RETRIEVE

router.delete('/users/:id',usersController.deleteUsers); //DELETE

//AUTHENTICATION

router.post('/login',usersController.login); //POST



module.exports = router;