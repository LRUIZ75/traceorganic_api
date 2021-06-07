// Last Updated: 07/06/2021 01:41:33 a. m.
// Updated By  : Luis Danilo Ruiz Tórrez
'use strict'

var express = require('express');
const { verify } = require('../middleware/access.middleware');

var warehousesController = require('../controllers/warehouses.controller');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_uploadpictures = multipart({uploadDir: './uploads/pictures/'});

/* 
C for Create: HTTP POST
R for Read: HTTP GET
U for Update: HTTP PUT
D for Delete: HTTP DELETE 
*/


// WAREHOUSES
router.post('/warehouses',  verify(), warehousesController.addWarehouses); //CREATE WAREHOUSES

router.put('/warehouses/:field/:id', [ verify(), md_uploadpictures], warehousesController.setPicture); //UPDATE WAREHOUSES IMAGE 
router.put('/warehouses/:id',  verify(), warehousesController.editWarehouses); //UPDATE WAREHOUSES

router.get('/warehouses/:id?',  verify(),warehousesController.getWarehouses); //RETRIEVE WAREHOUSES
router.get('/warehouses/images/:filename', warehousesController.getPicture); //RETRIEVE WAREHOUSES IMAGE 

router.delete('/warehouses/:id',  verify(), warehousesController.deleteWarehouses); //DELETE WAREHOUSES


module.exports = router;