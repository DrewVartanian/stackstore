// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var Product = mongoose.model('Product');
var User = mongoose.model('User');
var Review = mongoose.model('Review');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

describe('Review Route', function () {
  beforeEach('Establish DB connection', function (done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  afterEach('Clear test database', function (done) {
    clearDB(done);
  });

  describe('Unauthenticated request', function () {

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

    var mongoProduct;
    var mongoUser;
    var mongoReview;

    beforeEach('Create a review', function (done) {
      Product.create(productInfo).then(function(product){
        mongoProduct=product;
        return User.create(userInfo);
      }).then(function(user){
        mongoUser=user;
        var review={
          product:mongoProduct._id,
          user:mongoUser._id,
          text:'This is the review',
          rating:4
        };
        return Review.create(review);
      }).then(function(review){
        mongoReview=review;
        done();
      }).then(null,done);
    });

    var guestAgent;

    beforeEach('Create guest agent', function () {
      guestAgent = supertest.agent(app);
    });

    it('should get with 200 response and with an array as the body', function (done) {
      guestAgent.get('/api/reviews/products/'+mongoProduct._id).expect(200).end(function (err, response) {
        if (err) return done(err);
        expect(response.body.length).to.equal(1);
        done();
      });
    });

  });
});