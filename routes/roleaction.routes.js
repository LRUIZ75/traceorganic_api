// Last Updated: 26/05/2021 03:14:24 p. m.
// Updated By  : Luis Danilo Ruiz Tórrez
'use strict'

var express = require('express');
const { verify } = require('../middleware/access.middleware');

var roleactionController = require('../controllers/roleaction.controller');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_uploadpictures = multipart({uploadDir: './uploads/picture/'});

/* 
C for Create: HTTP POST
R for Read: HTTP GET
U for Update: HTTP PUT
D for Delete: HTTP DELETE 
*/


// ROLEACTION
router.post('/roleaction',  verify(), roleactionController.addRoleAction); //CREATE ROLEACTION


router.put('/roleaction/:id',  verify(), roleactionController.editRoleAction); //UPDATE ROLEACTION

router.get('/roleaction/:id?',  verify(),roleactionController.getRoleAction); //RETRIEVE ROLEACTION


router.delete('/roleaction/:id',  verify(), roleactionController.deleteRoleAction); //DELETE ROLEACTION


module.exports = router;