var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

// Require in all models.
require('../../../server/db/models');

var Order = mongoose.model('Order');
var Product = mongoose.model('Product');
var User = mongoose.model('User');

describe('Order model', function () {

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    it('should exist', function () {
        expect(Order).to.be.a('function');
    });

    describe('on creation', function() {

    //For refactoring: move all product creation to a before each

        var createUser = function () {
            return User.create({ email: 'obama@gmail.com', password: 'potus'});
        };

        var createProduct = function() {
            return Product.create({
                title: 'My tiny home',
                description: 'it is the best home',
                price: 2334.45,
                inventoryQuantity: 5,
                categories: ['best', 'tiny']
            });
        };



        var createOrder = function (itemobj) {
            return Order.create({
                session: '123',
                items: [{
                    productId: itemobj._id,
                    quantity: 2.5
                }]
            });
        };

        var createInvalidOrder = function (itemobj) {
            return Order.create({
                session: '123',
                items: [{
                    productId: itemobj._id,
                    quantity: -1
                }]
            });
        };


        describe('items array', function () {
            it('should have length of 1', function (done) {
                return createProduct().then(function(product) {
                    createOrder(product).then(function(order) {
                        expect(order.items.length).to.be.equal(1);
                        done();
                    });
                });
            });

            it('should populate the items array with the price of each item', function(done) {
                return createProduct().then(function(product) {
                    createOrder(product).then(function(order) {
                        expect(order.items[0].price).to.be.equal(2334.45);
                        done();
                    });
                });
            });

            it('should truncate the quantity of items in the item array', function(done) {
                return createProduct().then(function(product) {
                    createOrder(product).then(function(order) {
                        expect(order.items[0].quantity).to.be.equal(2);
                        done();
                    });
                });
            });

            //TODO: This is throwing validation error
            // it('item quantity should not be negative', function(done) {
            //     return createProduct().then(function(product) {
            //         return createInvalidOrder(product).exec();
            //     }).then(function(order) {
            //            throw new Error();
            //         }, function(err) {
            //             console.log('hi');
            //             expect(err).to.be.a('object');
            //         });
            // });

        });
         
         describe('total price', function(done) {
            //TO DO: make two items to test this more robustly
            it('should have the total price', function(done) {
                return createProduct().then(function(product) {
                    createOrder(product).then(function(order) {
                        expect(order.totalPrice).to.be.equal(2334.45*2);
                        done();
                    });
                });
            });

        });
        

    });
    

});
