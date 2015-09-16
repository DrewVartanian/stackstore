'use strict';

app.factory('ProductFactory', function($http) {

    var fetchAll = function() {
        return $http.get('/api/products/')
            .then(function(res) {
                return res.data;
            });
    };

     var fetch = function() {
        return $http.get('/api/products/:id')
            .then(function(res) {
                return res.data;
            });
    };

    return {
        fetchAll: fetchAll,
        fetch: fetch
    };
});