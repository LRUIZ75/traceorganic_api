// Last Updated: 14/05/2021 12:43:55 a. m.
// Updated By  : LRUIZ
'use strict'

var express = require('express');
const { verify } = require('../middleware/access.middleware');

var roleactionController = require('../controllers/roleaction.controller');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_uploadpictures = multipart({uploadDir: './uploads/logos/'});

/* 
C for Create: HTTP POST
R for Read: HTTP GET
U for Update: HTTP PUT
D for Delete: HTTP DELETE 
*/



// ROLEACTION
router.post('/roleaction',  verify(), roleactionController.addRoleAction); //CREATE


router.put('/roleaction/:id',  verify(), roleactionController.editRoleAction); //UPDATE

router.get('/roleaction/:id?',  verify(),roleactionController.getRoleAction); //RETRIEVE
//router.get('/roleaction',  verify(), roleactionController.getRoleAction); //RETRIEVE


router.delete('/roleaction/:id',  verify(), roleactionController.deleteRoleAction); //DELETE


module.exports = router;