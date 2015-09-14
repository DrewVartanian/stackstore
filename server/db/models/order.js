'use strict';

var mongoose = require('mongoose');

/**Requirement
- Orders must belong to a user OR guest session
- Orders must contain line items that capture the price, current product ID and quantity
- If a user completes an order, that order should keep the price of the item at the time when they checked out even if the price of the product later changes
*/

//populate guest later - session id? 
//Creating a new property called guest, and set it default as true, and user field default as false?
var guest = 'guest';

var orderSchema = new mongoose.Schema({
    user:  {type: Schema.Types.ObjectId, ref: 'User', default: guest},
    lineItem: {type: Schema.Types.ObjectId, ref: 'Product'},
    linePrice: {type: Number},
    quantity: {type: Number}
    total: {type: Number, required: true} //make it a virtual
});

orderSchema.pre("save", function(next){
    this.linePrice = this.lineItem.price;
    this.total = this.quantity * this.linePrice
});

mongoose.model('Order', orderSchema);