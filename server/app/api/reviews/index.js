'use strict';
var router = require('express').Router();
module.exports = router;
var Review = require('mongoose').model('Review');
//var User = require('mongoose').model('User');

//
router.delete('/:id', function(req, res, next){
    Review.findById(req.params.id).then(function(review){
        review.remove();
        res.sendStatus(204);
    }).then(null, next);
});

router.get('/products/:id', function(req, res, next) {
    Review.find({
            product: req.params.id
        })
        .populate('user', 'email').then(function(reviews) {
            res.json(reviews);
        }).then(null, next);
});

router.post('/products/:id/user/:userId/review/', function(req, res, next) {
    var newReview = {
        product: req.params.id,
        user: req.params.userId,
        text: req.body.review,
        rating: req.body.rating
    };
    Review.create(newReview).then(function(review) {
            res.json(review);
        })
        .then(null, next);

});


//router.get('/user/:id)