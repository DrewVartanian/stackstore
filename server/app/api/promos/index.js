'use strict';
var router = require('express').Router();
module.exports = router;
var Promo = require('mongoose').model('Promo');

router.get('/', function(req, res, next) { //next here

    Promo.find().then(function(promos) {
        res.json(promos);
    })
    .then(null, next);

});

router.get('/:id', function(req, res, next) { //next here

    Promo.findById(req.params.id).then(function(promo) {
        res.json(promo);
    })
    .then(null, next);

});