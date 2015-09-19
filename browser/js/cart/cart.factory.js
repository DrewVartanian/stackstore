'use strict';

app.factory('CartFactory', function($http) {

    var addToCart = function (cart, user, product) {

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
        
    };

    return {
        addToCart: addToCart
    };

});