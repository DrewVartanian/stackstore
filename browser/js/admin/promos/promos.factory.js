'use strict';

app.factory('PromosFactory', function($http) {

    var fetchAll = function() {
        return $http.get('/api/promos/')
            .then(function(res) {
                return res.data;
            });
    };

    var fetch = function(id) {
        return $http.get('/api/promos/' + id)
            .then(function(res) {
                return res.data;
            });
    };

    return {
        fetchAll: fetchAll,
        fetch: fetch
    };
});