var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var Promise = require('bluebird');

// Require in all models.
require('../../../server/db/models');

var Product = mongoose.model('Product');


describe('Product model', function() {

    function createProduct() {
        var testProduct = {
            title: 'Tiny Tree House',
            description: 'This is the description.',
            price: 100005.8,
            inventoryQuantity: 10.4,
            categories: ['treehouse', 'steel made']
        };

        return Product.create(testProduct);
    }

    function createInvalidProduct(badprod) {
        var product = badprod;
        return Product.create(product);
    }

    beforeEach('Establish DB connection', function(done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
        // if (mongoose.connection.db) return createProduct().then(done);
        // mongoose.connect(dbURI, function() {
        //     createProduct().then(done);
        // });

    });

    afterEach('Clear test database', function(done) {
        clearDB(done);
    });

    it('should exist', function() {
        expect(Product).to.be.a('function');
    });

    describe('Product Creation', function() {
        it('should create a new product', function() {
            createProduct().then(function(product) {
                expect(product).to.be.an('object');
            });
        });

    });

    describe('Categories', function() {
        describe('Category Validate Method', function() {
            it('should exist', function() {
                expect(Product.categoriesValidator).to.be.a('function');

            });
            it('should return true', function() {
                createProduct().then(function(prod) {
                    expect(Product.categoriesValidator(prod.categories)).to.be.true;
                });
            });
            it('should return false', function() {
                var bad = {
                    title: 'Test Empty Categories',
                    description: 'This is the test.',
                    price: 100005.8,
                    inventoryQuantity: 10,
                    categories: []
                };
                expect(Product.categoriesValidator(bad.categories)).to.be.false;
            });

        });
    });

    //  describe('Title', function(){
    //     describe('Title type', function () {
    //         it('should exist', function () {

    //             expect(product.title).to.be.a('String');
    //         });
    //         it('should satisfy minimum length', function () {
    //             expect(product.title.length >= 5).to.be.true;
    //         });
    //         it('should not overcede maximum length', function () {
    //             expect(product.title.length <= 25).to.be.true;
    //         });

    //     });
    //     describe('wrong title', function(){
    //             var testBadProdMin={
    //                 title: 'Tiny',
    //                 description: 'This is the description.',
    //                 price: 100005.8,
    //                 inventoryQuantity: 10,
    //                 categories: ['treehouse', 'steel made']
    //             };

    //             var testBadProdMax={
    //                 title: 'Tinyhouse 789is amazing why it is not sold yet',
    //                 description: 'This is the description.',
    //                 price: 100005.8,
    //                 inventoryQuantity: 10,
    //                 categories: ['treehouse', 'steel made']
    //             };

    //         it('should throw an error when title contains length longer than twenty five', function () {
    //             Product.create(testBadProdMax).then(null, function(badprod){
    //                 Product.find({}).then(function(products){

    //                 });
    //             });
    //         }); 

    //         it('should throw an error when title contains length less than five', function () {
    //             Product.create(testBadProdMax).then(function(){
    //                 throw new Error();
    //             }, function(err){
    //                 expect(err).to.be.an('object');
    //             });
    //         }); 
    //     })
    // });

    // describe('Description', function(){
    //     describe('description type', function () {
    //         it('should exist', function () {
    //             expect(Product.description).to.be.a('String');
    //         });
    //         it('should satisfy minimum length', function () {
    //             expect(Product.description.length >= 10).to.be.true;
    //         });
    //         it('should not overcede maximum length', function () {
    //             expect(Product.description.length <= 500).to.be.true;
    //         });

    //     });
    // });

    describe('Price', function() {
        describe('Price type', function() {

            it('should be an integer', function() {
                createProduct().then(function(prod) {
                    expect(Product.price === 100006).to.be.true;
                });
            });

        });
    });

    describe('Inventory Quantity', function() {
        describe('qty should be truncated', function() {
            it('should equal to integer', function() {
                createProduct().then(function(prod) {
                    expect(Product.inventoryQuantity === 10).to.be.true;
                });
            });
        });
    });

    // describe('Photo', function(){
    //     describe('photo type', function () {
    //         it('should exist', function () {
    //             expect(Product.photo).to.be.a('String');
    //         });

    //     });
    // });

    //  describe('Square Footage', function(){
    //     describe('sqFootage type', function () {
    //         it('should exist', function () {
    //             expect(Product.sqFootage).to.be.a('Number');
    //         });
    //         it('should not be negative', function () {
    //             expect(Product.sqFootage >= 0).to.be.true;
    //         });
    //     });
    // });


});