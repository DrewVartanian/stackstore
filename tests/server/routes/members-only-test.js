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

describe('Members Route', function() {

    beforeEach('Establish DB connection', function(done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function(done) {
        clearDB(done);
    });

    describe('Unauthenticated request', function() {

        var guestAgent;

        beforeEach('Create guest agent', function() {
            guestAgent = supertest.agent(app);
        });

        it('should get a 401 response', function(done) {
            guestAgent.get('/api/members/secret-stash')
                .expect(401)
                .end(done);
        });

    });

    describe('Authenticated request', function() {

        var loggedInAgent;

        var userInfo = {
            email: 'joe@gmail.com',
            password: 'shoopdawoop'
        };

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

        it('should get with 200 response and with an array as the body', function(done) {
            loggedInAgent.get('/api/members/secret-stash').expect(200).end(function(err, response) {
                if (err) return done(err);
                expect(response.body).to.be.an('array');
                done();
            });
        });

        it('should get user from id', function(done) {
            loggedInAgent.get('/api/members/' + mongoUser._id).expect(200).end(function(err, response) {
                if (err) return done(err);
                expect(response.body.email).to.equal(mongoUser.email);
                done();
            });
        });

        it('should create a user', function(done) {
            loggedInAgent.post('/api/members/').send({
                email: 'second@email.com'
            }).expect(201).end(function(err, response) {
                if (err) return done(err);
                User.find({}).then(function(users) {
                    expect(users.length).to.equal(2);
                    done();
                }).then(null, done);
            });
        });

        it('should delete a user', function(done) {
            loggedInAgent.delete('/api/members/' + mongoUser._id).expect(204).end(function(err, response) {
                if (err) return done(err);
                User.find({}).then(function(users) {
                    expect(users.length).to.equal(0);
                    done();
                }).then(null, done);
            });
        });

        it('should edit a user', function(done) {
            loggedInAgent.put('/api/members/' + mongoUser._id).send({
                email: 'new@email.com'
            }).expect(200).end(function(err, response) {
                if (err) return done(err);
                User.findById(mongoUser._id).then(function(user) {
                    expect(user.email).to.equal('new@email.com');
                    done();
                }).then(null, done);
            });
        });
    });

});
