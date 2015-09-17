'use strict';
var router = require('express').Router();
module.exports = router;
var Product = require('mongoose').model('Product');

router.get('/', function(req, res, next) { //next here

    Product.find().then(function(products) {
        res.json(products);
    })
    .then(null, next);

});

router.get('/:id', function(req, res, next) { //next here

    Product.findById(req.params.id).then(function(product) {
        res.json(product);
    })
    .then(null, next);

});