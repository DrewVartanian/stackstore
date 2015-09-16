'use strict';

app.config(function($stateProvider) {
    $stateProvider.state('product', {
        url: '/products/:id',
        templateUrl: 'js/products/detail/product.detail.html',
        controller: 'ProductDetailCtrl',
        resolve: {
            products: function(ProductFactory, $stateParams) {
                return ProductFactory.fetch($stateParams.id);
            }
        }
    });
});

app.controller('ProductDetailCtrl', function($scope, product) {
    $scope.product = product;
});