'use strict';
var router = require('express').Router();
module.exports = router;
var Review = require('mongoose').model('Review');
//var User = require('mongoose').model('User');

//
router.get('/products/:id', function(req, res, next) {
    Review.find({
        product: req.params.id
    })
    .populate('user', 'email').then(function(reviews) {
        res.json(reviews);
    }).then(null, next);
});

//router.get('/user/:id)