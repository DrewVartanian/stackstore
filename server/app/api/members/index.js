'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

router.param('userId', function(req, res, next, userId) {
    if (!req.user || (userId !== req.user._id.toString() && !req.user.isAdmin)) {
        var err = new Error('Wrong user');
        err.status = 403;
        return next(err);
    }
    User.findById(userId).then(function(user) {
            req.userParam = user;
            next();
        }).then(null, function(err) {
            err.status = 404;
            throw err;
        })
        .then(null, next);
});

router.get('/secret-stash', ensureAuthenticated, function(req, res) {

    var theStash = [
        'http://ep.yimg.com/ay/candy-crate/bulk-candy-store-2.gif',
        'http://www.dailybunny.com/.a/6a00d8341bfd0953ef0148c793026c970c-pi',
        'http://images.boomsbeat.com/data/images/full/44019/puppy-wink_1-jpg.jpg',
        'http://p-fst1.pixstatic.com/51071384dbd0cb50dc00616b._w.540_h.610_s.fit_.jpg',
        'http://childcarecenter.us/static/images/providers/2/89732/logo-sunshine.png',
        'http://www.allgraphics123.com/ag/01/10683/10683.jpg',
        'http://img.pandawhale.com/post-23576-aflac-dancing-duck-pigeons-vic-RU0j.gif',
        'http://www.eveningnews24.co.uk/polopoly_fs/1.1960527.1362056030!/image/1301571176.jpg_gen/derivatives/landscape_630/1301571176.jpg',
        'http://media.giphy.com/media/vCKC987OpQAco/giphy.gif',
        'https://my.vetmatrixbase.com/clients/12679/images/cats-animals-grass-kittens--800x960.jpg',
        'http://www.dailymobile.net/wp-content/uploads/2014/10/lollipops.jpg'
    ];

    res.send(_.shuffle(theStash));

});

router.get('/',function (req,res,next){
    User.find().then(function(users){
        users=users.map(function(user){
            return {_id:user._id,email:user.email};
        });
        res.json(users);
    }).then(null,next);
});

router.post('/', function(req, res, next) {
    console.log('Creating User');
    User.create(req.body).then(function(user) {
        console.log('User created: ' + user);
        if (!user) throw new Error('user not created');
        res.status(201).json({
            id: user._id
        });
    }).then(null, next);
});

router.delete('/:userId', function(req, res, next) {
    req.userParam.remove().then(function() {
        //check status code
        res.sendStatus(204);
    }).then(null, next);
});

router.put('/:userId', function(req, res, next) {
    //check req.body keys
    for (var key in req.body) {
        req.userParam[key] = req.body[key];
    }
    req.userParam.save().then(function(user) {
        res.status(200).json({
            id: user._id
        });
    }).then(null, next);
});

router.get('/:userId', function(req, res) {
    res.json({
        email: req.userParam.email,
        isAdmin: req.userParam.isAdmin
    });
});
