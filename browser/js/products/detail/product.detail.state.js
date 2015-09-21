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

app.controller('ProductDetailCtrl', function($scope, product, reviews, cart, user, CartFactory,$state) {
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

    $scope.addToCart = function(product) {

        return CartFactory.addToCart(cart, user, product)
        .then(function () {
            console.log("Item successfully added");
            CartFactory.getCartItemNum();
            $state.go('cart');
        });

    };

    $scope.isUser = function(){
        if(user){
            return true;
        }
        else return false;
    };

    $scope.submitReview = function(){
        if($scope.reviewContents){}
    };
});