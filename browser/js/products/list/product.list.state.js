'use strict';

app.config(function($stateProvider) {
    $stateProvider.state('products', {
        url: '/products',
        templateUrl: 'js/products/list/product.list.html',
        controller: 'ProductListCtrl',
        resolve: {
            products: function(ProductFactory) {
                return ProductFactory.fetchAll();
            },
            user: function(AuthService) {
                return AuthService.getLoggedInUser();
            },
            cart: function(MemberFactory, AuthService) {
                // If time permits find a way to do this with one query
                return AuthService.getLoggedInUser().then(function (user){
                    if (user) {
                        return MemberFactory.getCart(user);
                    }
                });
            }
        }
    });
});

app.controller('ProductListCtrl', function($scope, products, cart, user, CartFactory,$state) {
    $scope.products = products;
    $scope.filteredProducts = products;
    $scope.showFilter=false;
    $scope.headFilt='';

    $scope.addToCart = function(product) {
        CartFactory.addToCart(cart, user, product)
        .then(function () {
            console.log("Item successfully added");
            CartFactory.getCartItemNum();
            $state.go('cart');
        });
    };

    $scope.goToProduct = function(productId) {
        $state.go('product',{id:productId});
    };

    $scope.toggleFilter = function(){
        console.log('filter');
        $scope.showFilter=!$scope.showFilter;
    };

    $scope.setHeadFilt = function(filt){
        console.log('SET FILTER');
        $scope.headFilt=filt;
        if(filt===''){
            $scope.filteredProducts = products;
        }else{
            console.log(filt);
            $scope.filteredProducts = $scope.products.filter(function(prod){
                console.log(prod.categories.indexOf(filt)!==-1);
                return prod.categories.indexOf(filt)!==-1;
            });
            console.dir($scope.filteredProducts);
        }
    };
});