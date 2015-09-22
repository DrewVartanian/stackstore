'use strict';

app.factory('PromosFactory', function($http) {

    var fetchAll = function() {
        return $http.get('/api/promos/')
            .then(function(res) {
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
        return $http.get('/api/promos/code/'+code)
            .then(function(res) {
                return res.data;
            });
    };

    return {
        fetchAll: fetchAll,
        fetchById: fetchById,
        fetchByCode: fetchByCode
    };
});