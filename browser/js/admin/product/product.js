app.config(function($stateProvider) {

    $stateProvider.state('admin.product', {
        url: '/product/:productId',
        templateUrl: 'js/admin/product/product.html',
        controller: 'AdminProductController',
        resolve: {
            product: function(ProductFactory, $stateParams) {
                if ($stateParams.productId === 'new') return {};
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

app.controller('AdminProductController', function($scope, product, AdminProductFactory, $stateParams, $state) {
    $scope.product = product;
    $scope.newProduct = ($stateParams.productId === 'new');
    $scope.deleteProduct = function() {
        AdminProductFactory.deleteProduct($stateParams.productId).then(function() {
            $state.go('admin.products');
        });
    };
    $scope.editProduct = function() {
        if($scope.newProduct){
            AdminProductFactory.createProduct($scope.product).then(function() {
                $state.go('admin.products');
            });
        }else{
            AdminProductFactory.editProduct($scope.product).then(function() {
                $state.go('admin.products');
            });
        }
    };
});

app.factory('AdminProductFactory', function($http) {
    var editProduct = function(product) {
        return $http.put('/api/products/' + product._id, product)
            .then(function(res) {
                return res.data;
            });
    };

    var createProduct = function(product){
        return $http.post('/api/products',product)
            .then(function(res){
                return res.data;
            });
    };

    var deleteProduct = function(productId) {
        return $http.delete('/api/products/' + productId)
            .then(function() {
                return;
            });
    };

    return {
        editProduct: editProduct,
        createProduct: createProduct,
        deleteProduct: deleteProduct
    };
});
