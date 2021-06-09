// Last Updated: 08/06/2021 09:38:36 p. m.
// Updated By  : Luis Danilo Ruiz Tórrez
'use strict'

var express = require('express');
const { verify } = require('../middleware/access.middleware');

var warehouseController = require('../controllers/warehouse.controller');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_uploadpictures = multipart({uploadDir: './uploads/pictures/'});

/* 
C for Create: HTTP POST
R for Read: HTTP GET
U for Update: HTTP PUT
D for Delete: HTTP DELETE 
*/


// WAREHOUSE
router.post('/warehouse',  verify(), warehouseController.addWarehouse); //CREATE WAREHOUSE

router.put('/warehouse/:field/:id', [ verify(), md_uploadpictures], warehouseController.setPicture); //UPDATE WAREHOUSE IMAGE 
router.put('/warehouse/:id',  verify(), warehouseController.editWarehouse); //UPDATE WAREHOUSE

router.get('/warehouse/:id?',  verify(),warehouseController.getWarehouse); //RETRIEVE WAREHOUSE
router.get('/warehouse/images/:filename', warehouseController.getPicture); //RETRIEVE WAREHOUSE IMAGE 
router.get('/csv/warehouse',  verify(),warehouseController.getWarehouseCSV); //RETRIEVE WAREHOUSE CSV DATA 

router.delete('/warehouse/:id',  verify(), warehouseController.deleteWarehouse); //DELETE WAREHOUSE


module.exports = router;