// Instantiate all models
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

describe('Members Route', function () {

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

	describe('Unauthenticated request', function () {

		var guestAgent;

		beforeEach('Create guest agent', function () {
			guestAgent = supertest.agent(app);
		});

		it('should get a 401 response', function (done) {
			guestAgent.get('/api/members/secret-stash')
				.expect(401)
				.end(done);
		});

	});

	describe('Authenticated request', function () {

		var loggedInAgent;

		var userInfo = {
			email: 'joe@gmail.com',
			password: 'shoopdawoop'
		};

		var mongoUser;

		beforeEach('Create a user', function (done) {
			User.create(userInfo).then(function(user){
				mongoUser=user;
				done();
			}).then(null,done);
		});

		beforeEach('Create loggedIn user agent and authenticate', function (done) {
			loggedInAgent = supertest.agent(app);
			loggedInAgent.post('/login').send(userInfo).end(done);
		});

		it('should get with 200 response and with an array as the body', function (done) {
			loggedInAgent.get('/api/members/secret-stash').expect(200).end(function (err, response) {
				if (err) return done(err);
				expect(response.body).to.be.an('array');
				done();
			});
		});

		it('should get user from id',function(done){
			loggedInAgent.get('/api/members/'+mongoUser._id).expect(200).end(function (err, response) {
				if (err) return done(err);
				expect(response.body.email).to.equal(mongoUser.email);
				done();
			});
		});

		it('should create a user',function(done){
			loggedInAgent.post('/api/members/').send({email:'second@email.com'}).expect(201).end(function (err, response) {
				if (err) return done(err);
				User.find({}).then(function(users){
					expect(users.length).to.equal(2);
					done();
				}).then(null,done);
			});
		});

		it('should delete a user',function(done){
			loggedInAgent.delete('/api/members/'+mongoUser._id).expect(204).end(function (err, response) {
				if (err) return done(err);
				User.find({}).then(function(users){
					expect(users.length).to.equal(0);
					done();
				}).then(null,done);
			});
		});

		it('should edit a user',function(done){
			loggedInAgent.put('/api/members/'+mongoUser._id).send({email:'new@email.com'}).expect(200).end(function (err, response) {
				if (err) return done(err);
				User.findById(mongoUser._id).then(function(user){
					expect(user.email).to.equal('new@email.com');
					done();
				}).then(null,done);
			});
		});

		describe('Orders', function () {

			var productInfo = {
				title: 'product A',
				description: 'This is the product description',
				price: 5.50,
				inventoryQuantity: 2,
				categories: ['cat1']
			};

			var mongoOrder;
			var mongoCart;
			var mongoProduct;

			beforeEach('Create a user', function (done) {
				Product.create(productInfo).then(function(product){
					mongoProduct = product;
					var orderInfo = {
						session:"123",
						user:mongoUser._id,
						items:[{
							productId: product._id,
							price:5.50,
							quantity:1
						}],
						date:new Date()
					};

					return Order.create(orderInfo);
				}).then(function(order){
					mongoOrder=order;
				}).then(function(){
					var cartInfo = {
						session:"321",
						user:mongoUser._id,
						items:[{
							productId: mongoProduct._id,
							price:3.50,
							quantity:3
						}]
					};
					return Order.create(cartInfo);
				}).then(function(cart){
					mongoCart=cart;
					done();
				}).then(null,done);
			});

			it('should get orders',function(done){
				loggedInAgent.get('/api/members/'+mongoUser._id+'/orders').expect(200).end(function (err, response) {
					if (err) return done(err);
					expect(response.body[0]._id).to.equal(mongoOrder._id.toString());
					done();
				});
			});

			it('should get cart',function(done){
				loggedInAgent.get('/api/members/'+mongoUser._id+'/orders/cart').expect(200).end(function (err, response) {
					if (err) return done(err);
					expect(response.body._id).to.equal(mongoCart._id.toString());
					done();
				});
			});

			it('should get add date to cart',function(done){
				loggedInAgent.put('/api/members/'+mongoUser._id+'/orders/checkout').expect(200).end(function (err, response) {
					if (err) return done(err);
					expect(response.body.date).to.be.an('string');
					done();
				});
			});
		});

	});

});
