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
    for(var key in req.body){
      req.productParm[key]=req.body[key];
    }
    req.productParm.save().then(function(product) {
        //check status code
        res.status(product).json(product);
    }).then(null, next);
});