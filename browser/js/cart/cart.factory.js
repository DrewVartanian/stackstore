'use strict';

app.factory('CartFactory', function($http) {

    var addToCart = function (cart, user, product) {

        if (user) {
            if (cart) {
                return $http.put('/api/orders/cart/add/'+cart._id+'/'+product._id)
                .then(function (res){
                    return res.data;
                });

            }
            else {
                return $http.put('/api/orders/cart/add/'+product._id)
                .then(function (res){
                    return res.data;
                });
            }
        }

        else {
            if (!localStorage.getItem('cart')) {
                var localCart = "";
                localStorage.setItem('cart', localCart);
            }


            localCart = localStorage.getItem('cart');
            localCart += product.title+":"+product._id+":"+product.price+":"+1+",";
            localStorage.setItem('cart', localCart);

            return new Promise(function (resolve, reject){
                resolve(cart);
            })
        }
        
    };

    var convertLocalStorageToCart = function() {

        var ls = localStorage.getItem('cart');

        var cartItems = ls.split(',');
        cartItems.pop();
        var finalCart = [];
        var cartObj = {};

        for (var i=0; i<cartItems.length; i++) {
            cartItems[i] = cartItems[i].split(":");
            var title = cartItems[i][0];
            var _id = cartItems[i][1];
            var price = cartItems[i][2];
            var quantity = cartItems[i][3];
            cartObj = {};
            cartObj.productId = {};
            cartObj.productId.title = title;
            cartObj.price = price;
            cartObj.quantity = quantity;
            finalCart.push(cartObj);   
        }
        return {items: finalCart};
    };

    return {
        addToCart: addToCart,
        convertLocalStorageToCart: convertLocalStorageToCart
    };

});

// Clean UP make put/post routes and use the req.user to find the order
