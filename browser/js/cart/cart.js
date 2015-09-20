app.config(function ($stateProvider) {

    $stateProvider.state('cart', {
        url: '/cart',
        templateUrl:  'js/cart/cart.html',
        controller: 'CartController',
        resolve: {
            cart: function(MemberFactory, AuthService,CartFactory) {
                // If time permits find a way to do this with one query
                return AuthService.getLoggedInUser().then(function (user){
                    if (user) {
                        return MemberFactory.getCart(user);
                    }
                    else{
                        return CartFactory.convertLocalStorageToCart();
                    }
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

app.controller('CartController',function ($scope, cart, MemberFactory, $state, CartFactory,AuthService) {

    console.log("Showing cart in CartController:", cart)
    // if (cart) {
    $scope.cart=cart;
    // }

    // else {
    //     CartFactory.convertLocalStorageToCart().then(function(cart){
    //         console.log('getting cart');
    //         $scope.cart=cart;
    //     }).then(null,function(err){
    //         console.log('failed');
    //     });
    // }

    $scope.cart.items.forEach(function(item){
        item.total=item.productId.price*item.quantity;
    });

	$scope.removeItemFromOrder = function (item){
        if(AuthService.isAuthenticated()){
    		MemberFactory.removeOrderItem(cart, item).then(function(){
    			$state.reload();
    		});
        }else{
            localCart = localStorage.getItem('cart');
            var localCart=localCart.split(',');
            var indexDel;
            if(localCart.some(function(entry,index){
                entry=entry.split(':');
                if(entry[1]===item.productId._id){
                    indexDel=index;
                    return true;
                }
                return false;
            })){
                localCart.splice(indexDel,1);
                localCart=localCart.join(',');
            }
            localStorage.setItem('cart', localCart);
            $state.reload();
        }
	};

    $scope.updateOrderItem = function(item) {
        if(item.quantity>item.productId.inventoryQuantity){
            item.quantity=item.productId.inventoryQuantity;
        }
        if(AuthService.isAuthenticated()){
            MemberFactory.updateOrderItem(cart, item).then(function() {
                $state.reload();
                //do we want to say 'successfully updated' on the page?
            });
        }else{
            localCart = localStorage.getItem('cart');
            var localCart=localCart.split(',');
            if(localCart.some(function(entry,index){
                entry=entry.split(':');
                if(entry[1]===item.productId._id){
                    console.log(entry[3]);
                    entry[3]=item.quantity;
                    entry=entry.join(':');
                    localCart[index]=entry;
                    return true;
                }
                return false;
            })){
                localCart=localCart.join(',');
            }
            console.log(localCart);
            localStorage.setItem('cart', localCart);
            $state.reload();
        }
    };

    $scope.getTotal = function() {
        return cart.items.map(function(item) {
            return item.total;
        }).reduce(function(a,b) {
            return a+b;
        },0);
    };

    //Go to Check Out page
     $scope.checkout = function() {
        console.log("it's clicked");
        $state.go('checkout');
     };

});