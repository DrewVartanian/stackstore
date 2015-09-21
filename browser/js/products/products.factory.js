'use strict';

app.factory('ProductFactory', function($http) {

    var fetchAll = function() {
        return $http.get('/api/products/')
            .then(function(res) {
                return res.data;
            });
    };

    var fetch = function(id) {
        return $http.get('/api/products/' + id)
            .then(function(res) {
                return res.data;
            });
    };

    var fetchReviews = function(id) {
        return $http.get('/api/reviews/products/' + id)
            .then(function(res) {
                return res.data;
            });
    };

    var postReviews = function(reviewContents, rating, userId, productId) {
        return $http.post('/api/reviews/products/' + productId + '/user/' + userId + "/review/", {review: reviewContents, rating: rating})
            .then(function(res) {
                return res.data;
            });
    };


    return {
        fetchAll: fetchAll,
        fetch: fetch,
        fetchReviews: fetchReviews,
        postReviews: postReviews
    };
});