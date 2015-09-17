'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Order = mongoose.model('Order');

router.param('userId', function(req, res, next, userId) {
    if (!req.user || userId !== req.user._id.toString()) {
        var err = new Error('Wrong user');
        err.status = 403;
        coneole.log("ERROR");
        next(err);
    }
    req.userId = userId;
    next();
});

router.get('/:userId/history', function(req, res, next) {
    //res.json({orderId: 123456});
    Order.find({
        user: req.userId,
        date: {
            $ne: null
        }
    }).populate('items.productId').exec().then(function(orders) {
        res.status(200).json(orders);
    }).then(null, next);
});


router.get('/:userId/cart', function(req, res, next) {

    Order.findOne({
        user: req.userId,
        date: null
    }).populate('items.productId').exec().then(function(cart) {
        res.status(200).json(cart);
    }).then(null, next);

});

router.put('/:userId/checkout', function(req, res, next) {
    Order.findOne({
        user: req.userId,
        date: null
    }).populate('items.productId').exec().then(function(cart) {
        cart.date = new Date();
        return cart.save();
    }).then(function(order) {
        res.status(200).json(order);
    }).then(null, next);

});
