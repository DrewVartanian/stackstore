var mongoose = require('mongoose');
require('../../../server/db/models');
var User = mongoose.model('User');
var Product = mongoose.model('Product');
var Order = mongoose.model('Order');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

describe('Order Route', function() {

    beforeEach('Establish DB connection', function(done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function(done) {
        clearDB(done);
    });

    describe('Members', function() {
        var loggedInAgent;
        var productInfo = {
            title: 'product A',
            description: 'This is the product description',
            price: 5.50,
            inventoryQuantity: 2,
            categories: ['cat1']
        };

        var userInfo = {
            email: 'joe@gmail.com',
            password: 'shoopdawoop'
        };

        var mongoOrder;
        var mongoCart;
        var mongoProduct;
        var mongoUser;

        beforeEach('Create a user', function(done) {
            User.create(userInfo).then(function(user) {
                mongoUser = user;
                done();
            }).then(null, done);
        });

        beforeEach('Create loggedIn user agent and authenticate', function(done) {
            loggedInAgent = supertest.agent(app);
            loggedInAgent.post('/login').send(userInfo).end(done);
        });

        beforeEach('Create a user', function(done) {
            Product.create(productInfo).then(function(product) {
                mongoProduct = product;
                var orderInfo = {
                    session: "123",
                    user: mongoUser._id,
                    items: [{
                        productId: product._id,
                        price: 5.50,
                        quantity: 1
                    }],
                    date: new Date()
                };

                return Order.create(orderInfo);
            }).then(function(order) {
                mongoOrder = order;
            }).then(function() {
                var cartInfo = {
                    session: "321",
                    user: mongoUser._id,
                    items: [{
                        productId: mongoProduct._id,
                        price: 3.50,
                        quantity: 3
                    }]
                };
                return Order.create(cartInfo);
            }).then(function(cart) {
                mongoCart = cart;
                done();
            }).then(null, done);
        });

        it('should get orders', function(done) {
            // expect(0).to.equal(0);
            // done();
            loggedInAgent.get('/api/orders/members/' + mongoUser._id + '/history').expect(200).end(function(err, response) {
                if (err) return done(err);
                expect(response.body[0]._id).to.equal(mongoOrder._id.toString());
                done();
            });
        });

        it('should get cart', function(done) {
            loggedInAgent.get('/api/orders/members/' + mongoUser._id + '/cart').expect(200).end(function(err, response) {
                if (err) return done(err);
                expect(response.body._id).to.equal(mongoCart._id.toString());
                done();
            });
        });

        it('should get add date to cart', function(done) {
            loggedInAgent.put('/api/orders/members/' + mongoUser._id + '/checkout').expect(200).end(function(err, response) {
                if (err) return done(err);
                expect(response.body.date).to.be.an('string');
                done();
            });
        });
    });
});
