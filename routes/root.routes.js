'use strict'


var express = require('express');

var rootRouter = express.Router();


rootRouter.get("/",function(req,res,next){
    res.redirect(302,"/doc");
    next();
});



module.exports = rootRouter;