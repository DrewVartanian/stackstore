'use strict';

var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
    product:  {type: Schema.Types.ObjectId, ref: 'Product'},
    user:  {type: Schema.Types.ObjectId, ref: 'User'},
    review: {type: String, required: true, min: 4}
});


var Review = mongoose.model('Review', reviewSchema);

module.exports = {Review: Review};