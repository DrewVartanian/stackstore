// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var Product = mongoose.model('Product');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

describe('Products Route', function () {
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

    var mongoProduct;

    beforeEach('Create a product', function (done) {
      Product.create(productInfo).then(function(product){
        mongoProduct=product;
        done();
      });
    });

    var guestAgent;

    beforeEach('Create guest agent', function () {
      guestAgent = supertest.agent(app);
    });

    it('should get with 200 response and with an array as the body', function (done) {
      guestAgent.get('/api/products/').expect(200).end(function (err, response) {
        if (err) return done(err);
        expect(response.body.length).to.equal(1);
        done();
      });
    });

    it('should get with 200 response and with the product as the body', function (done) {
      guestAgent.get('/api/products/'+mongoProduct._id).expect(200).end(function (err, response) {
        if (err) return done(err);
        expect(response.body._id).to.equal(mongoProduct._id.toString());
        done();
      });
    });

  });
});