var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

// Require in all models.
require('../../../server/db/models');

var Product = mongoose.model('Product');

describe('Product model', function () {

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    it('should exist', function () {
        expect(Product).to.be.a('function');
    });

    describe('Categories', function(){
        describe('Category Validate Method', function () {
            it('should exist', function () {
                expect(Product.categoriesValidator).to.be.a('function');
            });
            it('should return true', function () {
                expect(Product.categoriesValidator(/**value?*/))).to.be.a('boolean');
            });

        });
    });
    
     describe('Title', function(){
        describe('Title type', function () {
            it('should exist', function () {
                expect(Product.title).to.be.a('String');
            });
            it('should satisfy minimum length', function () {
                expect(Product.title.length >= 5)).to.be.true;
            });
            it('should not overcede maximum length', function () {
                expect(Product.title.length <= 25)).to.be.true;
            });

        });
    });
    
    describe('Description', function(){
        describe('description type', function () {
            it('should exist', function () {
                expect(Product.description).to.be.a('String');
            });
            it('should satisfy minimum length', function () {
                expect(Product.description.length >= 10)).to.be.true;
            });
            it('should not overcede maximum length', function () {
                expect(Product.description.length <= 500)).to.be.true;
            });

        });
    });

    describe('Price', function(){
        describe('Price type', function () {
            it('should exist', function () {
                expect(Product.price).to.be.a('Number');
            });
            it('should not be negative', function () {
                expect(Product.price >= 0).to.be.true;
            });
            //how to test the set function?
        });
    });

    describe('Inventory Quantity', function(){
        describe('qty type', function () {
            it('should exist', function () {
                expect(Product.inventoryQuantity).to.be.a('Number');
            });
            it('should not be negative', function () {
                expect(Product.inventoryQuantity >= 0).to.be.true;
            });
            //how to test the set function?
        });
    });

    describe('Photo', function(){
        describe('photo type', function () {
            it('should exist', function () {
                expect(Product.photo).to.be.a('String');
            });

        });
    });
    
     describe('Square Footage', function(){
        describe('sqFootage type', function () {
            it('should exist', function () {
                expect(Product.sqFootage).to.be.a('Number');
            });
            it('should not be negative', function () {
                expect(Product.sqFootage >= 0).to.be.true;
            });
        });
    });


});