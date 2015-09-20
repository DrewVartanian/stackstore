'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var mongoose = require('mongoose');
//var User = mongoose.model('User');
var Order = mongoose.model('Order');
var Product = mongoose.model('Product');


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


//This route is for creating a cart and adding a product to it
router.put('/add/:itemId', function (req,res,next){

	Product.findById(req.params.itemId).then(function(product) {
		var productToBeAdded = {
			price: product.price,
			productId: product._id,
			quantity: 1
		}
		var cartToBeMade = {
			session: req.session.toString(),
			user: req.user._id,
			items: [productToBeAdded]
		}
		Order.create(cartToBeMade).then(function(cart){
			res.status(204).end();
		})
    })
    .then(null, next);
});

// This route is for adding a product to an existing cart
router.put('/add/:cartId/:itemId', function (req,res,next){

	Product.findById(req.params.itemId).then(function(product) {
		Order.findById(req.params.cartId).then(function(cart){
			var productToBeAdded = {
				price: product.price,
				productId: product._id,
				quantity: 1
			}
			cart.items.push(productToBeAdded);
			cart.save().then(function(){
				res.status(204).end();
			})
		});
    })
    .then(null, next);
});

// Clean UP make put/post routes and use the req.user to find the order

// router.put('/add/:cartId/:itemId', function (req,res,next){

// 	Product.findById(req.params.itemId).then(function(product) {
// 		console.log("Req.user")
// 		Order.find({user: req.user}).then(function(cart){
// 			var productToBeAdded = {
// 				price: product.price,
// 				productId: product._id,
// 				quantity: 1
// 			}
// 			cart.items.push(productToBeAdded);
// 			cart.save().then(function(){
// 				res.status(204).end();
// 			})
// 		});
//     })
//     .then(null, next);
// });
