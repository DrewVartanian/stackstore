'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var mongoose = require('mongoose');
var User = mongoose.model('User');

/**email template logic*/
var fs = require('fs');
var ejs = require('ejs');
var csvFile = fs.readFileSync('friend_list.csv', 'utf8');
var tumblr = require('tumblr.js');
var emailTemplate = fs.readFileSync('email_template.ejs', 'utf8');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('XXXXXXXXXXXXXX');

router.get('/',function (req,res,next){
    User.find().then(function(users){
        users=users.map(function(user){
            return {_id:user._id,email:user.email};
        });
        res.json(users);
    }).then(null,next);
});


var mandrillConfig = app.getValue('env').MANDRILL;

    var mandrillCredentials = {
        key: mandrillConfig.key
    };