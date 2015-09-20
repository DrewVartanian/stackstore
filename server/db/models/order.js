'use strict';

var mongoose = require('mongoose');
var Promise = require('bluebird');
mongoose.Promise = Promise;

/**Requirement
- Orders must belong to a user OR guest session
- Orders must contain line items that capture the price, current product ID and quantity
- If a user completes an order, that order should keep the price of the item at the time when they checked out even if the price of the product later changes
*/

//populate guest later - session id?
//Creating a new property called guest, and set it default as true, and user field default as false?

var orderSchema = new mongoose.Schema({
    //session is used for guests
    session: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        price: {
            type: Number
        },
        quantity: {
            type: Number,
            min: 0,
            default: 1,
            set: function(val) {
                return Math.trunc(val);
            }
        }
    }],
    date: Date,
    promoCode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Promo'
    }
});

orderSchema.pre('save', function(next) {
    var Product = mongoose.model('Product');
    var promises = [];
    // console.log('this is the this!', this);
    this.items.forEach(function(item) {
        // console.log('item', item);
        promises.push(Product.findById(item.productId).then(function(product) {
            // console.log('product', product);
            item.price = product.price;
        }));
    });
    // console.log('AT THE PROMISE.ALL');
    Promise.all(promises).then(next,next);
});

orderSchema.virtual('totalPrice').get(function() {
    return this.items.reduce(function(sum, item) {
        return sum + (item.price * item.quantity);
    }, 0);
});

mongoose.model('Order', orderSchema);
