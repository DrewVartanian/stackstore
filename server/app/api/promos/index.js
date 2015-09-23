'use strict';
var router = require('express').Router();
module.exports = router;
var Promo = require('mongoose').model('Promo');

router.get('/', function(req, res, next) { //next here

    if(req.query.code) {
        Promo.findOne({code: req.query.code}).then(function(promo) {
            res.json(promo);
        })
        .then(null, next);
    }
    else {
        Promo.find().then(function(promos) {
            res.json(promos);
        })
        .then(null, next);
    }

});

router.get('/:id', function(req, res, next) { //next here

    Promo.findById(req.params.id).then(function(promo) {
            res.json(promo);
        })
        .then(null, next);

});

// router.get('/code', function(req, res, next) { //next here
//     console.log('CCCCCOOOOOOOODDDDDEEEE', req.query.code);

//     Promo.findOne({code: req.query.code}).then(function(promo) {
//             res.json(promo);
//         })
//         .then(null, next);

// });

router.post('/', function(req, res, next) {
    var newPromo = {};
    if (typeof req.body.code !== 'undefined') newPromo.code = req.body.code;
    if (typeof req.body.creationDate !== 'undefined') newPromo.creationDate = req.body.creationDate;
    if (typeof req.body.expirationDate !== 'undefined') newPromo.expirationDate = req.body.expirationDate;
    if (typeof req.body.valueOff !== 'undefined') newPromo.valueOff = req.body.valueOff;
    if (typeof req.body.type !== 'undefined') newPromo.type = req.body.type;
    if (typeof req.body.categories !== 'undefined') newPromo.categories = req.body.categories;
    if (typeof req.body.products !== 'undefined') newPromo.products = req.body.products;
    Promo.create(newPromo).then(function(promo) {
            res.json(promo);
        })
        .then(null, next);
});

router.put('/:id', function(req, res, next) {
    if (!req.user.isAdmin) {
        var err = new Error('Admins Only');
        err.status = 403;
        return next(err);
    }
    Promo.findById(req.params.id).then(function(promo) {
        if (typeof req.body.code !== 'undefined') promo.code = req.body.code;
        if (typeof req.body.creationDate !== 'undefined') promo.creationDate = req.body.creationDate;
        if (typeof req.body.expirationDate !== 'undefined') promo.expirationDate = req.body.expirationDate;
        if (typeof req.body.valueOff !== 'undefined') promo.valueOff = req.body.valueOff;
        if (typeof req.body.type !== 'undefined') promo.type = req.body.type;
        if (typeof req.body.categories !== 'undefined') promo.categories = req.body.categories;
        if (typeof req.body.products !== 'undefined') promo.products = req.body.products;
        promo.save().then(function(newPromo) {
            console.log('success! new promo is', newPromo);
            //check status code
            res.status(201).json(newPromo);
        }).then(null, next);
    }).then(null, next);
});

router.delete('/:id', function(req, res, next) {
    if (!req.user.isAdmin) {
        var err = new Error('Admins Only');
        err.status = 403;
        return next(err);
    }

    Promo.remove({
        _id: req.params.id
    }).then(function() {
        res.sendStatus(204);

    }).then(null, next);
});
