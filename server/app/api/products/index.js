'use strict';
var router = require('express').Router();
module.exports = router;
var Product = require('mongoose').model('Product');

router.get('/', function(req, res, next) { //next here

    Product.find().then(function(products) {
        res.json(products);
    })
    .then(null, next);

});

router.post('/', function(req, res, next) { //next here
    var newProduct={};
    if(typeof req.body.title!=='undefined') newProduct.title = req.body.title;
    if(typeof req.body.description!=='undefined') newProduct.description = req.body.description;
    if(typeof req.body.price!=='undefined') newProduct.price = req.body.price;
    if(typeof req.body.inventoryQuantity!=='undefined') newProduct.inventoryQuantity = req.body.inventoryQuantity;
    if(typeof req.body.categories!=='undefined') newProduct.categories = req.body.categories;
    if(typeof req.body.photo!=='undefined') newProduct.photo = req.body.photo;
    if(typeof req.body.sqFootage!=='undefined') newProduct.sqFootage = req.body.sqFootage;
    Product.create(newProduct).then(function(product) {
        res.json(product);
    })
    .then(null, next);
});

router.param('id', function (req,res,next,id){
  Product.findById(id).then(function(product) {
      req.productParm=product;
      next();
  }).then(null,function(err){
    err.status = 404;
    throw err;
  }).then(null,next);
});

router.get('/:id', function(req, res, next) { //next here
    res.json(req.productParm);
});

router.delete('/:id', function(req, res, next) { //next here
    if(!req.user.isAdmin){
      var err = new Error('Admins Only');
      err.status = 403;
      return next(err);
    }
    req.productParm.remove().then(function() {
        //check status code
        res.sendStatus(204);
    }).then(null, next);
});

router.put('/:id', function(req, res, next) { //next here
    if(!req.user.isAdmin){
      var err = new Error('Admins Only');
      err.status = 403;
      return next(err);
    }
    if(typeof req.body.title!=='undefined') req.productParm.title = req.body.title;
    if(typeof req.body.description!=='undefined') req.productParm.description = req.body.description;
    if(typeof req.body.price!=='undefined') req.productParm.price = req.body.price;
    if(typeof req.body.inventoryQuantity!=='undefined') req.productParm.inventoryQuantity = req.body.inventoryQuantity;
    if(typeof req.body.categories!=='undefined') req.productParm.categories = req.body.categories;
    if(typeof req.body.photo!=='undefined') req.productParm.photo = req.body.photo;
    if(typeof req.body.sqFootage!=='undefined') req.productParm.sqFootage = req.body.sqFootage;
    req.productParm.save().then(function(product) {
        //check status code
        res.status(product).json(product);
    }).then(null, next);
});