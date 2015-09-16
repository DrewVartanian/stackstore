'use strict';

var mongoose = require('mongoose');

//Checks that there is at least one category
function categoriesValidator(value) {
    return (value.length > 0);
}

var productSchema = new mongoose.Schema({

    //add max and min length in future
    title: {
        type: String,
        required: true,
        unique: true,
        maxlength: 25,
        minlength: 5
    },
    description: {
        type: String,
        required: true,
        maxlength: 500,
        minlength: 10
    },
    price: {
        type: Number,
        required: true,
        set: function(val) {
            val = Math.ceil(val * 100) / 100;
            return val;
        },
        min: 0
    },
    inventoryQuantity: {
        type: Number,
        required: true,
        set: function(val) {
            val = Math.trunc(val);
            return val;
        },
        min: 0
    },
    categories: {
        type: [String],
        required: true,
        validate: [categoriesValidator, "There must be at least one category!"]
    },
    photo: {
        type: String,
        default: 'https://s-media-cache-ak0.pinimg.com/236x/57/2c/c2/572cc24bf2835562aa0c3c5ab5524886.jpg'
    },
    sqFootage: {
        type: Number,
        min: 0
    }

});

productSchema.statics.categoriesValidator = categoriesValidator;

mongoose.model('Product', productSchema);
