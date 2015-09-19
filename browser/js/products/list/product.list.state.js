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

app.controller('ProductListCtrl', function($scope, products, cart, user, CartFactory) {
    $scope.products = products;

    $scope.addToCart = function(product) {
     
        if(user) {
            CartFactory.addToCart(cart, user, product)
            .then(function () {
                console.log("Item successfully added");
            })
        }

        else {
            if (!localStorage.getItem('cart')) {
                var localCart = ""
                localStorage.setItem('cart', localCart);
                console.log("Current localStorage: ", localStorage.getItem('cart'));
            }
            localCart = localStorage.getItem('cart');
            localCart += product._id+":"+1+",";
            localStorage.setItem('cart', localCart);
        }

    };
});