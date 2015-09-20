'use strict';
var router = require('express').Router();
module.exports = router;
var Promo = require('mongoose').model('Promo');

router.get('/', function(req, res, next) { //next here

    Promo.find().then(function(promos) {
        res.json(promos);
    })
    .then(null, next);

});

router.get('/:id', function(req, res, next) { //next here

    Promo.findById(req.params.id).then(function(promo) {
        res.json(promo);
    })
    .then(null, next);

});

router.post('/', function(req, res, next) {
    Promo.create(req.body).then(function(promo) {
        res.json(promo);
    })
    .then(null, next);
});

router.put('/:id', function(req, res, next) {
    if(!req.user.isAdmin){
      var err = new Error('Admins Only');
      err.status = 403;
      return next(err);
    }
    Promo.findById(req.params.id).then(function(promo) {
      for(var key in req.body){
      promo[key]=req.body[key];
      }
      promo.save().then(function(newPromo) {
        //check status code
        res.status(201).json(newPromo);
      }).then(null, next);
    }).then(null, next);
    
});

router.delete('/:id', function(req, res, next) {
    if(!req.user.isAdmin){
      var err = new Error('Admins Only');
      err.status = 403;
      return next(err);
    }

    Promo.remove({_id: req.params.id}).then(function() {
      res.sendStatus(204);

    }).then(null, next);
});