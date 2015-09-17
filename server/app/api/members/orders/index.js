'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Order = mongoose.model('Order');

// var ensureAuthenticated = function (req, res, next) {
//     if (req.isAuthenticated()) {
//         next();
//     } else {
//         res.status(401).end();
//     }
// };

router.get('/', function (req,res,next){
    //res.json({orderId: 123456});

    Order.find({user: req.userParam._id,date:{$ne:null}}).populate('items.productId').exec().then(function(orders){
        res.status(200).json(orders);
    }).then(null, next);

});

router.get('/cart', function (req,res,next){

    Order.findOne({user: req.userParam._id,date:null}).populate('items.productId').exec().then(function(cart){
        res.status(200).json(cart);
    }).then(null, next);

});

