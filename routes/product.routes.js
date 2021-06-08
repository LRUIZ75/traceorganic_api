// Last Updated: 07/06/2021 11:47:02 p. m.
// Updated By  : Luis Danilo Ruiz Tórrez
'use strict'

var express = require('express');
const { verify } = require('../middleware/access.middleware');

var productController = require('../controllers/product.controller');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_uploadpictures = multipart({uploadDir: './uploads/pictures/'});

/* 
C for Create: HTTP POST
R for Read: HTTP GET
U for Update: HTTP PUT
D for Delete: HTTP DELETE 
*/


// PRODUCT
router.post('/product',  verify(), productController.addProduct); //CREATE PRODUCT

router.put('/product/:field/:id', [ verify(), md_uploadpictures], productController.setPicture); //UPDATE PRODUCT IMAGE 
router.put('/product/:id',  verify(), productController.editProduct); //UPDATE PRODUCT

router.get('/product/:id?',  verify(),productController.getProduct); //RETRIEVE PRODUCT
router.get('/product/images/:filename', productController.getPicture); //RETRIEVE PRODUCT IMAGE 

router.delete('/product/:id',  verify(), productController.deleteProduct); //DELETE PRODUCT


module.exports = router;