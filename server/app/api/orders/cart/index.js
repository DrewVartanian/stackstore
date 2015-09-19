'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var mongoose = require('mongoose');
//var User = mongoose.model('User');
var Order = mongoose.model('Order');


router.put('/remove/:cartId/:itemId', function(req,res,next){
	Order.findById(req.params.cartId).then(function(cart){

		for(var i=0; i<cart.items.length; i++) {
			if (cart.items[i]._id == req.params.itemId) {
				cart.items.splice(i, 1);
				cart.save().then(function(){
					res.status(204).end();
					
				});
				
			}
		}

	})
});


router.put('/update/:cartId', function(req,res,next){
	Order.findById(req.params.cartId).then(function(cart){
		console.log("req.body.time", req.body.date);
		cart.date = req.body.date;
		cart.save().then(function(){
			console.log("time populated", cart.date);
			res.status(204).end();				
		});

	})
});


router.put('/update/:cartId/:itemId', function(req,res,next){
	Order.findById(req.params.cartId).then(function(cart){

		for(var i=0; i<cart.items.length; i++) {
			if (cart.items[i]._id == req.params.itemId) {
				cart.items[i].quantity = req.body.quantity;
				cart.save().then(function(){
					res.status(204).end();
					
				});
				
			}
		}

	})
});

