'use strict';

app.config(function($stateProvider) {
    $stateProvider.state('products', {
        url: '/products',
        templateUrl: 'js/products/list/product.list.html',
        controller: 'ProductListCtrl',
        resolve: {
            products: function(ProductFactory) {
                return ProductFactory.fetchAll();
            }
        }
    });
});

app.controller('ProductListCtrl', function($scope, products) {
    $scope.products = products;
});