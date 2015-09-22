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
    $scope.ratingArr=[];
    $scope.catString='';
    product.categories.forEach(function(cat,index){
        cat=cat.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
        $scope.catString+=cat;
        if(index!==product.categories.length-1){
            $scope.catString+=' | ';
        }
    });
    var avg = 0;
    reviews.forEach(function(review){
        avg+=review.rating;
    });
    if(avg!==0){
        avg=Math.round(avg/reviews.length);
    }
    $scope.avgReview=[];
    for(var i=0; i<avg; i++){
        $scope.avgReview.push(i+1);
    }

    $scope.isAdmin = user?user.isAdmin:false;


    $scope.reviewError = false;
    $scope.ratingError = false;


    var generateUsernames = function() {
        $scope.reviews.forEach(function(review) {
            var re = /^(.*)@/;
            var name;
            if(review.user){
                name = review.user.email.match(re)[1];
            }else{
                name = 'Anonymous';
                review.user = {};
            }
            review.user.email = name;

        });

    };

    generateUsernames();

    $scope.getNumber = function(num) {
        var array = [];
        for (var i = 0; i < num; i++) {
            array.push(i);
        }
        return array;
    };

    $scope.addToCart = function(product) {

        return CartFactory.addToCart(cart, user, product)
        .then(function () {
            CartFactory.getCartItemNum();
            $state.go('cart');
        });

    };

    $scope.isUser = function(){
        if(user){
            return true;
        }
        else {
            return false;
        }

    };

    $scope.removeReview = function(review){
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

    $scope.updateRating = function(){
        $scope.ratingArr=[];
        for(var i=0; i<$scope.rating; i++){
            $scope.ratingArr.push(i+1);
        }
    };
});