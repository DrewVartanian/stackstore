app.config(function ($stateProvider) {

    $stateProvider.state('admin.products', {
        url: '/products',
        templateUrl:  'js/admin/products/products.html',
        controller: 'AdminProductsController',
        resolve:{
            products: function(ProductFactory){
                return ProductFactory.fetchAll();
            }
        },
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }
    });

});

app.controller('AdminProductsController',function ($scope, products) {
    console.log(products);
   $scope.products = products;
   $scope.productSearch='';
   $scope.filteredProducts=products;
   $scope.searchProducts = function() {
        if (!$scope.productSearch) {
            $scope.filteredProducts = products;
        } else {
            var re = new RegExp($scope.productSearch,"i");
            $scope.filteredProducts = products.filter(function(product) {
                return re.test(product.title)||re.test(product.description);
            });
        }
    };
});

