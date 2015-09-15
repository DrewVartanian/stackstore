var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var Promise = require('bluebird');

// Require in all models.
require('../../../server/db/models');

var Review = mongoose.model('Review');
var Product = mongoose.model('Product');
var User = mongoose.model('User');
var user;
var product;
function createUserProduct(){
    var testUser={
        email: 'team@quad.com',
        password: 'passw0rd'
    };
    var testProduct={
        title: 'Tiny House A',
        description: 'This is the description.',
        price: 5,
        inventoryQuantity: 10,
        categories: ['cat1']
    };
    var userPromise=User.create(testUser).then(function(mongoUser){
      user=mongoUser;
    });
    return Product.create(testProduct).then(function(mongoProduct){
      product=mongoProduct;
      return userPromise;
    });
}

describe('Review model', function () {
  beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return createUserProduct().then(done);
        mongoose.connect(dbURI, function(){
          createUserProduct().then(done);
        });
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    it('should exist', function () {
        expect(Review).to.be.a('function');
    });

    describe('Doc creation',function(){
      it('should allow you to add a review to collection', function(){
        var testReview={
          product:product._id,
          user:user._id,
          review:{
            text:'Home is where the heart is',
            rating: 4
          }
        };
        return Review.create(testReview).then(function(review){
          return Review.findById(review._id);
        }).then(function(review){
          expect(review).to.be.an('object');
        });
      });
    });

    describe('Validation', function(){
        it('should require product ', function () {
            var testReview={
              user:user._id,
              review:{
                text:'Home is where the heart is',
                rating: 4
              }
            };
            return Review.create(testReview).then(function(){
              throw new Error();
            },function(err){
              expect(err).to.be.an('object');
            });
        });
        it('should require user ', function () {
            var testReview={
              product:product._id,
              review:{
                text:'Home is where the heart is',
                rating: 4
              }
            };
            return Review.create(testReview).then(function(){
              throw new Error();
            },function(err){
              expect(err).to.be.an('object');
            });
        });
        it('should require review text ', function () {
            var testReview={
              user:user._id,
              product:product._id,
              review:{
                rating: 4
              }
            };
            return Review.create(testReview).then(function(){
              throw new Error();
            },function(err){
              expect(err).to.be.an('object');
            });
        });
        it('should require text length be at least 4', function () {
            var testReview={
              user:user._id,
              product:product._id,
              review:{
                text:'No',
                rating: 1
              }
            };
            return Review.create(testReview).then(function(){
              throw new Error();
            },function(err){
              expect(err).to.be.an('object');
            });
        });
        it('should require review rating ', function () {
            var testReview={
              user:user._id,
              product:product._id,
              review:{
                text:'Home is where the heart is'
              }
            };
            return Review.create(testReview).then(function(){
              throw new Error();
            },function(err){
              expect(err).to.be.an('object');
            });
        });
        it('should require ratings >= 1', function () {
            var testReview={
              user:user._id,
              product:product._id,
              review:{
                text:'Home is where the heart is',
                rating: 0
              }
            };
            return Review.create(testReview).then(function(){
              throw new Error();
            },function(err){
              expect(err).to.be.an('object');
            });
        });
        it('should require ratings <= 5', function () {
            var testReview={
              user:user._id,
              product:product._id,
              review:{
                text:'Home is where the heart is',
                rating: 6
              }
            };
            return Review.create(testReview).then(function(){
              throw new Error();
            },function(err){
              expect(err).to.be.an('object');
            });
        });
    });
});