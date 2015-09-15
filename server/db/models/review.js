'use strict';

var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required:true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    review: {
        text: {
            type: String,
            required: true,
            minlength: 4
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            set: function(val) {
                return (Math.round(val));
            }
        }
    }
});


mongoose.model('Review', reviewSchema);
