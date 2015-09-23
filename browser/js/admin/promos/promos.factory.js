'use strict';

app.factory('PromosFactory', function($http) {

    var fetchAll = function() {
        return $http.get('/api/promos/')
            .then(function(res) {
                console.log(res.data);
                return res.data;
            });
    };

    var fetchById = function(id) {
        return $http.get('/api/promos/' + id)
            .then(function(res) {
                return res.data;
            });
    };

    var fetchByCode = function(code) {
        return $http.get('/api/promos/', {params: {code: code}})
            .then(function(res) {
                return res.data;
            });
    };

    var discount = function(itemPrice, promo) {
        if (promo.type==='percent') {
            return (itemPrice-itemPrice*(promo.valueOff/100)).toFixed(2);
        }
        if (promo.type==='dollar') {
            var discounted = (itemPrice-promo.valueOff).toFixed(2);
            return (discounted > 0) ? discounted : 0;
        }
    };

    return {
        fetchAll: fetchAll,
        fetchById: fetchById,
        fetchByCode: fetchByCode,
        discount: discount
    };
});