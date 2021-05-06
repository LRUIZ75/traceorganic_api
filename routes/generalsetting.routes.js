
'use strict'

var express = require('express');

const { verify } = require('../middelware/access.middleware');

var generalsettingController = require('../controllers/generalsetting.controller');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_uploadpictures = multipart({uploadDir: './uploads/logos/'});

/* 
C for Create: HTTP POST
R for Read: HTTP GET
U for Update: HTTP PUT
D for Delete: HTTP DELETE 
*/



// GENERALSETTING
router.post('/generalsetting',  generalsettingController.addGeneralSetting); //CREATE

router.put('/generalsetting/picture/:id', [verify, md_uploadpictures], generalsettingController.setPicture); //UPDATE IMAGE 
//router.put('/generalsetting/:id', verify, generalsettingController.editGeneralSetting); //UPDATE
router.put('/generalsettin/:id', generalsettingController.editGeneralSetting); //UPDATE

router.get('/generalsetting/:id?', generalsettingController.getGeneralSetting); //RETRIEVE
router.get('/generalsetting',  generalsettingController.getGeneralSetting); //RETRIEVE
router.get('/generalsetting/picture/:filename', generalsettingController.getPicture); //RETRIEVE IMAGE 

router.delete('/generalsetting/:id', verify, generalsettingController.deleteGeneralSetting); //DELETE


module.exports = router;