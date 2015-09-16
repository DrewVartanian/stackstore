'use strict';
var router = require('express').Router();
module.exports = router;
var Product = require('mongoose').model('Product');

router.get('/', function(req, res) { //next here

    Product.find().then(function(products) {
        res.json(products);
        //next();
    })

});