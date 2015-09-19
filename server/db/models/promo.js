'use strict';

var mongoose = require('mongoose');

var promoSchema = new mongoose.Schema({

    //add max and min length in future
    code: {
        type: String,
        required: true,
        unique: true,
        maxlength: 10,
        minlength: 5
    },
    creationDate: {
        type: Date,
        required: true,
    },
    expirationDate: {
        type: Date,
        required: true,
    },
    ValueOff: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    categories: {
        type: [String],
        default: []
    },
    product: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Product',
        default: []
    }
    
});


mongoose.model('Promo', promoSchema);
