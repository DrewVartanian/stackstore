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

app.controller('CartController',function ($scope, cart, MemberFactory, $state, CartFactory) {

    console.log("Showing cart in CartController:", cart)
    if (cart) {
        $scope.cart=cart;
    }

    else {
        $scope.cart = CartFactory.convertLocalStorageToCart();
    }

    $scope.cart.items.forEach(function(item){
        item.total=item.productId.price*item.quantity;
    });

	$scope.removeItemFromOrder = function (item){
		MemberFactory.removeOrderItem(cart, item).then(function(){
			$state.reload();
		});
	};

    $scope.updateOrderItem = function(item) {
        if(item.quantity>item.productId.inventoryQuantity){
            item.quantity=item.productId.inventoryQuantity;
        }
        MemberFactory.updateOrderItem(cart, item).then(function() {
            $state.reload();
            //do we want to say 'successfully updated' on the page?
        });
    };

    $scope.getTotal = function() {
        return cart.items.map(function(item) {
            return item.total;
        }).reduce(function(a,b) {
            return a+b;
        });
    };

    //Go to Check Out page
     $scope.checkout = function() {
        console.log("it's clicked");
        $state.go('checkout');
     };

});