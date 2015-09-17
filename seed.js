/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var User = Promise.promisifyAll(mongoose.model('User'));
var Product = Promise.promisifyAll(mongoose.model('Product'));
var Review = Promise.promisifyAll(mongoose.model('Review'));
var Order = Promise.promisifyAll(mongoose.model('Order'));

var seedUsers = function () {

    var users = [
        {
            email: 'testing@fsa.com',
            password: 'password'
        },
        {
            email: 'obama@gmail.com',
            password: 'potus'
        }
    ];

    return User.createAsync(users);


};

var seedProducts = function () {

    var products = [];
    var letter;
    for(var i=0;i<26;i++){
        letter=String.fromCharCode(65+i);
        products.push({
            title: letter+' tiny house '+letter,
            description: letter+':  This is tiny house '+letter+'!',
            price:(i*7127/100),
            inventoryQuantity: 5,
            categories:[letter],
            sqFootage:(i+10)*(i+10)
        });
    }

    return Product.createAsync(products);


};

var seedReviews = function(users,products) {
    var reviews =[];
    for(var i=0;(i<users.length)&&(i<2);i++){
        for(var j=0;j<=i;j++){
            reviews.push({
                user:users[i]._id,
                product:products[i]._id,
                text: i+" I like "+i,
                rating: i*2+j+1
            });
        }
    }
    return Review.createAsync(reviews);
};

var seedOrders= function(users,products) {
    var orders =[];
    for(var i=0;(i<users.length)&&(i<2);i++){
        for(var j=0;j<=i;j++){
            orders.push({
                session: '1'+i.toString()+j.toString(),
                user:users[i]._id,
                items:[{
                    productId:products[i+(j+1)*3]._id,
                    quantity: i+j+2
                },{
                    productId:products[i+(j+1)*3+1]._id,
                    quantity: i+j+3
                }],
                date: new Date()
            });
        }
    }
    return Order.createAsync(orders);
};

connectToDb.then(function () {
    var mongoUsers;
    var mongoProducts;
    User.findAsync({}).then(function (users) {
        if (users.length === 0) {
            return seedUsers();
        } else {
            console.log(chalk.magenta('Seems to already be user data, exiting!'));
            return users;
        }
    }).then(function (users){
        mongoUsers=users;
    }).then(function(){
        return Product.findAsync({});
    }).then(function (products) {
        if (products.length === 0) {
            return seedProducts();
        } else {
            console.log(chalk.magenta('Seems to already be product data, exiting!'));
            return products;
        }
    }).then(function (products){
        mongoProducts=products;
    }).then(function(){
        return Review.findAsync({});
    }).then(function (reviews) {
        if (reviews.length === 0) {
            return seedReviews(mongoUsers,mongoProducts);
        } else {
            console.log(chalk.magenta('Seems to already be review data, exiting!'));
            return reviews;
        }
    }).then(function (){
        return Order.findAsync({});
    }).then(function (orders){
        if (orders.length === 0) {
            return seedOrders(mongoUsers,mongoProducts);
        } else {
            console.log(chalk.magenta('Seems to already be order data, exiting!'));
            return orders;
        }
    }).then(function () {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    }).catch(function (err) {
        console.error(err);
        process.kill(1);
    });
});
