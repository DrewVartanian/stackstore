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
    $scope.search='';
    $scope.minPrice='';
    $scope.maxPrice='';
    $scope.minFt='';
    $scope.maxFt='';
    $scope.stock=false;

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

    $scope.filterHead=function(filt){
        $scope.search='';
        $scope.filter(filt);
    };

    $scope.filter = function(filt){
        $scope.headFilt=filt;
        var all = filt===''?true:false;
        $scope.filteredProducts = $scope.products.filter(function(prod){
            var re=new RegExp($scope.search,"i");
            var match = (prod.categories.indexOf(filt)!==-1||all);
            match = match&&(re.test(prod.title)||re.test(prod.description));
            if($scope.minPrice!=='') match=match&&$scope.minPrice<prod.price;
            if($scope.maxPrice!=='') match=match&&$scope.maxPrice>prod.price;
            if($scope.minFt!=='') match=match&&$scope.minFt<prod.sqFootage;
            if($scope.maxFt!=='') match=match&&$scope.maxFt>prod.sqFootage;
            if($scope.stock) match=match&&prod.inventoryQuantity;
            return match;
        });
    };
});