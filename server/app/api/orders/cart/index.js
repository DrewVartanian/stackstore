'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var mongoose = require('mongoose');
//var User = mongoose.model('User');
var Order = mongoose.model('Order');

router.put('/:cartId/:itemId', function(req,res,next){
	Order.findById(req.params.cartId).then(function(cart){
		console.log(cart.items);

		for(var i=0; i<cart.items.length; i++) {
			console.log("Inside For Loop");
			console.log("Params: ", req.params.itemId)
			console.log("Cart Item", cart.items[i]._id)
			if (cart.items[i]._id == req.params.itemId) {
				console.log("Ids matched")
				cart.items.splice(i, 1);
				cart.save().then(function(){
					console.log("Item removed from cart");
					res.status(204).end();
					
				});
				
			}
		}

	})
});