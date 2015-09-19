app.config(function($stateProvider) {

    $stateProvider.state('admin.product', {
        url: '/product/:productId',
        templateUrl: 'js/admin/product/product.html',
        controller: 'AdminProductController',
        resolve: {
            product: function(ProductFactory,$stateParams) {
                if($stateParams.productId==='new') return {};
                return ProductFactory.fetch($stateParams.productId);
            }
        },
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }
    });

});

app.controller('AdminProductController', function($scope, product) {
    $scope.product=product;
});