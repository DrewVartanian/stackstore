app.config(function($stateProvider) {

    $stateProvider.state('checkout', {
        url: '/checkout',
        templateUrl: 'js/checkout/checkout.html',
        controller: 'CheckOutController',
        resolve: {
            user: function(AuthService) {
                // If time permits find a way to do this with one query
                return AuthService.getLoggedInUser().then(function(user) {
                    return user;
                });
            },
            cart: function(CartFactory) {
                // If time permits find a way to do this with one query
                return CartFactory.getCart();
                // return AuthService.getLoggedInUser().then(function(user) {
                //     return MemberFactory.getCart(user);
                // });
            },
            promos: function(PromosFactory) {
                return PromosFactory.fetchAll();
            }
        }
    });

});

app.controller('CheckOutController', function(MemberFactory, $scope, $state, cart, user, PromosFactory,CartFactory) {

    $scope.cart = cart;
    $scope.notPromo = false;

    $scope.getTotal = function() {
        return $scope.cart.items.map(function(item) {
            return item.quantity * item.price;
        }).reduce(function(a, b) {
            return a + b;
        });
    };
    $scope.amount = $scope.getTotal();

    $scope.cart.items.forEach(function(item){
        item.total=item.productId.price*item.quantity;
    });


    $scope.paymentSubmit = function() {

        MemberFactory.editOrder($scope.cart, $scope.amount, $scope.customer, $scope.promo).then(function(newOrder) {

            if(!user) localStorage.clear();
            CartFactory.getCartItemNum();
            if(!user){
                $state.go("home");
            }
            else{
                $state.go("membersOnly.view");
            }
        });
    };



    $scope.applyCode = function() {
        PromosFactory.fetchByCode($scope.promoCode).then(function(promo) {
            if (promo===null) $scope.notPromo = true;
            else $scope.notPromo = false;

                $scope.cart.items.forEach(function(item) {
                    if(promo.categories.length>0) {
                        promo.categories.forEach(function(cat) {
                            if(item.productId.categories.indexOf(cat) > -1) {
                                item.price = PromosFactory.discount(item.price, promo);
                            }
                        });
                    }
                    else if(promo.products.length>0) {
                        if(promo.products.indexOf(item.productId._id)> -1) {
                            item.price = PromosFactory.discount(item.price, promo);
                        }
                    }
                    else {
                        item.price = PromosFactory.discount(item.price, promo);
                    }
                    
                });
                
                $scope.amount = $scope.getTotal();
                
            

            $scope.cart.items.forEach(function(item){
                item.total=item.price*item.quantity;
            });

            $scope.promo = promo;

        });
    };



});

// app.factory('CheckoutFactory',function ($http){

//     var sendEmail = function(name, email, orders){
//         return $http.put('/api/checkout', {name: name, email: email, orders: orders})
//         .then(function(res){
//             return res.data;
//         });
//     };

//     return {
//         sendEmail: sendEmail
//     };
// });