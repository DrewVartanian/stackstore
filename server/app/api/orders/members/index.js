'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var mongoose = require('mongoose');
var Order = mongoose.model('Order');
var nodemailer = require('nodemailer');
 var fs = require('fs');
var ejs = require('ejs');
var emailTemplate = fs.readFileSync(__dirname +'/order_summary.ejs', 'utf8');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'tinyhomes.eco@gmail.com',
        pass: 'tinyhomes'
    }
});


/**email template logic*/



// var mandrillConfig = app.getValue('env').MANDRILL;
// var mandrillCredentials = {
//     key: mandrillConfig.key
// };
// var mandrill = require('mandrill-api/mandrill');
// var mandrill_client = new mandrill.Mandrill(mandrillCredentials.key);

// var sendEmail = function(to_name, to_email, from_name, from_email, subject, message_html) {
//     var message = {
//         "html": message_html,
//         "subject": subject,
//         "from_email": from_email,
//         "from_name": from_name,
//         "to": [{
//             "email": to_email,
//             "name": to_name
//         }],
//         "important": false,
//         "track_opens": true,
//         "auto_html": false,
//         "preserve_recipients": true,
//         "merge": false,
//         "tags": [
//             "Tiny Home Order Summary"
//         ]
//     };
//     var async = false;
//     var ip_pool = "Main Pool";
//     mandrill_client.messages.send({
//         "message": message,
//         "async": async,
//         "ip_pool": ip_pool
//     }, function(result) {
//         // console.log(message);
//         // console.log(result);   
//     }, function(e) {
//         // Mandrill returns the error as an object with name and message keys
//         console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
//         // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
//     });
// }


router.param('userId', function(req, res, next, userId) {
    if (!req.user || userId !== req.user._id.toString()) {
        var err = new Error('Wrong user');
        err.status = 403;
        next(err);
    }
    req.userId = userId;
    next();
});

router.get('/:userId/history', function(req, res, next) {
    //res.json({orderId: 123456});
    Order.find({
        user: req.userId,
        date: {
            $ne: null
        }
    }).populate('items.productId').exec().then(function(orders) {
        res.status(200).json(orders);
    }).then(null, next);
});


router.get('/:userId/cart', function(req, res, next) {

    Order.findOne({
        user: req.userId,
        date: null
    }).populate('items.productId').exec().then(function(cart) {
        res.status(200).json(cart);
    }).then(null, next);

});

/**
/api/orders/members/:userId/checkout
*/

router.put('/checkout', function(req, res, next) {
    var pOrder;
    var orders = req.body.orders;
    if(!orders._id){
        var guestOrder = {
            session:'123',
            items: [],
            date: new Date(),
            promoCode: req.body.promoCode
        };
        var guestProduct;
        orders.items.forEach(function(item){
            guestProduct={
                productId:item.productId._id,
                price: item.price,
                quantity: item.quantity
            };
            guestOrder.items.push(guestProduct);
        });
        pOrder = Order.create(guestOrder);
    }else{
        pOrder = Order.findOne({
            user: req.user._id,
            date: null
        }).populate('items.productId').exec()
        .then(function(cart) {
            cart.date = new Date();
            cart.promoCode = req.body.promoCode;
            cart.items.forEach(function(item){
                orders.items.forEach(function(clientItem){
                    if(item.productId._id.toString()===clientItem.productId._id.toString()){
                        item.price=clientItem.price;
                        item.quantity=clientItem.quantity;
                    }
                });
            });
            return cart.save();
        }).then(function(savedCart){
            orders = savedCart;
        });
    }
    pOrder.then(function(order) {
        //value here is undefined
        //email logic
        var copy = emailTemplate;
        var customizedTemplate = ejs.render(copy, {
            "name": req.body.name,
            "email": req.body.email,
            "orders": orders.items,
            "totalPrice": req.body.total
        });

        console.log("customizedTemplate type", typeof customizedTemplate);
       transporter.sendMail({
           from: 'tinyhomes.eco@gmail.com',
           to: req.body.email,
           subject: 'Tiny Home Order Summary',
           html: customizedTemplate
       });
        //sendEmail(req.body.name, req.body.email, "Tiny Home", "tinyhome@eco.org", "Tiny Home Order Summary", customizedTemplate);

        res.status(200).json(order);
    }).then(null, next);

});