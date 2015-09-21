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
        }
    });

});

app.controller('CheckOutController', function(MemberFactory, $scope, $state, cart, user) {

    $scope.cart = cart;

    $scope.getTotal = function() {
        return cart.items.map(function(item) {
            return item.quantity * item.price;
        }).reduce(function(a, b) {
            return a + b;
        });
    };
    $scope.amount = $scope.getTotal();


    $scope.paymentSubmit = function() {

        MemberFactory.editOrder(user._id, cart, $scope.amount, $scope.customer).then(function(cart) {
            $state.go("membersOnly.view");
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