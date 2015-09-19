app.config(function ($stateProvider) {

    $stateProvider.state('cart', {
        url: '/cart',
        templateUrl:  'js/cart/cart.html',
        controller: 'CartController',
        resolve: {
            cart: function(MemberFactory, AuthService) {
                // If time permits find a way to do this with one query
                return AuthService.getLoggedInUser().then(function (user){
                    if (user) {
                        return MemberFactory.getCart(user);
                    }
                    else return;
                });
            }
        }
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        // data: {
        //     authenticate: true
        // }

    });

});

app.controller('CartController',function ($scope, cart, MemberFactory, $state) {
    console.log("Showing cart in CartController:", cart)
    if (cart) {
        $scope.cart=cart;
    }
    else {
        console.log(localStorage.getItem('cart'));
    }

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

    $scope.updateOrderItem = function(item) {
        MemberFactory.updateOrderItem(cart, item).then(function() {
            $state.reload();
            //do we want to say 'successfully updated' on the page?
        });
    };

    $scope.getTotal = function() {
        return cart.items.map(function(item) {
            return item.quantity*item.price;
        }).reduce(function(a,b) {
            return a+b;
        });
    };


});