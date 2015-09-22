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

app.controller('ProductDetailCtrl', function($scope, product, reviews, cart, user, CartFactory,$state, ProductFactory) {
    $scope.product = product;
    $scope.reviews = reviews;

    $scope.isAdmin = user.isAdmin;

    

    $scope.reviewError = false;
    $scope.ratingError = false;


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
        console.log("i am user", user);
        console.log("i am cart", cart);
        if(cart){
            return true;
        }
        else {
            return false;
        }

    };

    $scope.removeReview = function(review){
        console.log("i am review", review);
        ProductFactory.deleteReviews(review._id);
        $state.reload();
    };

    $scope.submitReview = function(){
        if($scope.reviewContents && $scope.rating){
            $scope.reviewError = false;
            $scope.ratingError = false;
            ProductFactory.postReviews($scope.reviewContents, $scope.rating, user._id, product._id);
            $state.reload();
        }
        else{
            if(!$scope.reviewContents) $scope.reviewError = true; 
            else $scope.reviewError = false;
            if(!$scope.rating) $scope.ratingError = true;
            else $scope.ratingError = false;

        }

    };
});