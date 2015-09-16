'use strict';

app.config(function($stateProvider) {
    $stateProvider.state('product', {
        url: '/products/:id',
        templateUrl: 'js/products/detail/product.detail.html',
        controller: 'ProductDetailCtrl',
        resolve: {
            product: function(ProductFactory, $stateParams) {
                return ProductFactory.fetch($stateParams.id);
            },
            reviews: function(ProductFactory, $stateParams) {
                return ProductFactory.fetchReviews($stateParams.id);
            }
        }
    });
});

app.controller('ProductDetailCtrl', function($scope, product, reviews) {
    $scope.product = product;
    $scope.reviews = reviews;

    var generateUsernames = function() {
        $scope.reviews.forEach(function(review) {
            var re = /^(.*)@/;
            var name = review.user.email.match(re)[1];
            review.user.email = name;

        });

    };

    generateUsernames();

    $scope.getNumber = function(num) {
        var array = [];
        for (var i = 0; i < num; i++) {
            array.push(i);
        }
        console.log("generatArray", array);
        return array;
    };
});