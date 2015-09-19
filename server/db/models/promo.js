'use strict';

var mongoose = require('mongoose');

var promoSchema = new mongoose.Schema({

    //add max and min length in future
    code: {
        type: String,
        required: true,
        unique: true,
        maxlength: 15,
        minlength: 4
    },
    creationDate: {
        type: Date,
        required: true,
    },
    expirationDate: {
        type: Date,
        required: true,
    },
    valueOff: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        //can be either 'percent', or 'dollar', should add a validator for that
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
