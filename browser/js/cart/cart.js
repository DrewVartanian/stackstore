app.config(function ($stateProvider) {

    $stateProvider.state('cart', {
        url: '/cart',
        templateUrl:  'js/cart/cart.html',
        controller: 'CartController',
        resolve: {
            cart: function(MemberFactory, AuthService) {
            	console.log("attempting to re-resolve")
                // If time permits find a way to do this with one query
                return AuthService.getLoggedInUser().then(function (user){
                    return MemberFactory.getCart(user);
                });
            }
        },
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }

    });

});

app.controller('CartController',function ($scope, cart, MemberFactory, $state) {

    $scope.cart=cart;
    // AuthService.getLoggedInUser().then(function (user){
    //     $scope.user = user;
    // });
    // SecretStash.getStash().then(function (stash) {
    //     $scope.stash = stash;
    // });
	$scope.removeItemFromOrder = function (item){
		MemberFactory.removeOrderItem(cart, item).then(function(){
			$state.reload();
			
		});
	};
});