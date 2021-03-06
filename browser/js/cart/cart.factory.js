'use strict';

app.factory('CartFactory', function($http,AuthService,MemberFactory) {

    var addToCart = function (cart, user, product) {

        if (user) {
            if (cart) {
                return $http.put('/api/orders/cart/add/'+product._id)
                .then(function (res){
                    return res.data;
                });

            }
            else {
                return $http.post('/api/orders/cart/add/'+product._id)
                .then(function (res){
                    return res.data;
                });
            }
        }

        else {
            if (!localStorage.getItem('cart')) {
                var localCart = "";
                localStorage.setItem('cart', localCart);
            }


            localCart = localStorage.getItem('cart');
            var localCart=localCart.split(',');
            if(localCart.every(function(item,index){
                item=item.split(':');
                if(item[1]===product._id){
                    console.log(item[3]);
                    item[3]=Math.min(Number(item[3])+1,product.inventoryQuantity);
                    item=item.join(':');
                    localCart[index]=item;
                    return false;
                }
                return true;
            })){
                localCart=localCart.join(',');
                localCart += product.title+":"+product._id+":"+product.price+":"+1+",";
            }else{
                localCart=localCart.join(',');
            }
            console.log(localCart);
            localStorage.setItem('cart', localCart);

            return new Promise(function (resolve, reject){
              resolve(cart);
            });
        }
    };

    var getCart = function() {

        return AuthService.getLoggedInUser().then(function(user){
            if(!user) throw new Error();
            return AuthService.getLoggedInUser().then(function (user){
                return MemberFactory.getCart(user);
            }).then(function(cart){
                if(!cart) return {items:[]};
                return cart;
            }).then(null, function(err){
                return {items:[]};
            });
        }).then(null,function(err){
            var ls = localStorage.getItem('cart');
            if(!ls) return new Promise(function(resolve,reject){
                resolve({items:[]});
            });
            var cartItems = ls.split(',');
            cartItems.pop();
            var finalCart = [];
            var cartObj = {};
            var promises = [];

            for (var i=0; i<cartItems.length; i++) {
                cartItems[i] = cartItems[i].split(":");
                var title = cartItems[i][0];
                var _id = cartItems[i][1];
                var price = cartItems[i][2];
                var quantity = cartItems[i][3];
                promises.push($http.get('/api/products/'+_id));
                cartObj = {};
                cartObj.productId = {};
                cartObj.productId.title = title;
                cartObj.price = price;
                cartObj.quantity = quantity;
                finalCart.push(cartObj);
            }
            return Promise.all(promises).then(function(products){
                // console.log(finalCart);
                products.forEach(function(product,index){
                    finalCart[index].productId=product.data;
                });
                console.log('post',finalCart);
                return {items: finalCart};
            });
            // return {items: finalCart};
        });
    };

    var cartLength = {length: 0};
    var getCartItemNum = function() {
                getCart().then(function(cart) {
                    console.log('cart', cart);
                    var sum = 0;
                    if (cart.items) {
                        cart.items.forEach(function(item) {
                            console.log('qty', item.quantity);
                            sum += Number(item.quantity);
                        });
                    }
                    cartLength.length = sum;
                });
            };

    return {
        addToCart: addToCart,
        getCart: getCart,
        getCartItemNum: getCartItemNum,
        cartLength: cartLength
    };

});

// Clean UP make put/post routes and use the req.user to find the order
