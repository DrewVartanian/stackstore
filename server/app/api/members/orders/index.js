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
    console.log("this is going to show orders when its done");
    //res.json({orderId: 123456});

    Order.find({user: req.userParam._id}).populate('items.productId').exec().then(function(orders){
        console.log("Orders: ",orders);
        res.status(200).json(orders);
    }).then(null, next);

});

