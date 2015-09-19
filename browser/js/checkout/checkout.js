app.config(function ($stateProvider) {

    $stateProvider.state('checkout', {
        url: '/checkout',
        templateUrl:  'js/checkout/checkout.html',
        controller: 'CheckOutController',
        resolve: {
            cart: function(MemberFactory, AuthService) {
                // If time permits find a way to do this with one query
                return AuthService.getLoggedInUser().then(function (user){
                    return MemberFactory.getCart(user);
                });
            }
        }
    });

});

app.controller('CheckOutController',function (MemberFactory, $scope, cart) {
    $scope.getTotal = function() {
        return cart.items.map(function(item) {
            return item.quantity*item.price;
        }).reduce(function(a,b) {
            return a+b;
        });
    };
    $scope.amount = $scope.getTotal();

        
    $scope.paymentSubmit = function(){
        MemberFactory.editOrder(cart).then(function(cart) {
            return cart;
        });
    };


});