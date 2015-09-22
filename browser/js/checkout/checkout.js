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
            }
            promos: function(PromosFactory) {
                return PromosFactory.fetchAll();
            }
        }
    });

});

app.controller('CheckOutController', function(MemberFactory, $scope, $state, cart, user, PromosFactory) {

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

        MemberFactory.editOrder(user._id, $scope.cart, $scope.amount, $scope.customer).then(function(cart) {
            $state.go("home");
        });
    };



    $scope.applyCode = function() {
        PromosFactory.fetchByCode($scope.promoCode).then(function(promo) {
            console.log('promo', promo);
            if (promo===null) $scope.notPromo = true;
            else $scope.notPromo = false;



            if (promo.categories.length>0) console.log('has categories!');
            if (promo.products.length>0) console.log('has products!');
            else {
                console.log('for all products');
                $scope.cart.items.forEach(function(item) {
                    item.price = PromosFactory.discount(item.price, promo);
                });
                console.log($scope.cart);
                $scope.amount = $scope.getTotal();
                
            }

            $scope.cart.items.forEach(function(item){
                item.total=item.price*item.quantity;
            });

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