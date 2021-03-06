app.config(function ($stateProvider) {

    $stateProvider.state('membersOnly', {
        url: '/members-area',
        templateUrl:  'js/members-only/members-only.html',
        controller: 'MemberController',
        resolve:{
            user: function(AuthService){
                return AuthService.getLoggedInUser();
            }
        },
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }
    });

});

app.controller('MemberController',function ($scope, SecretStash,AuthService,user) {
    $scope.user = user;
    // SecretStash.getStash().then(function (stash) {
    //     $scope.stash = stash;
    // });
});

app.factory('SecretStash', function ($http) {

    var getStash = function () {
        return $http.get('/api/members/secret-stash').then(function (response) {
            return response.data;
        });
    };

    return {
        getStash: getStash
    };

});

app.factory('MemberFactory',function ($http){


    var editUser = function(user,changes){
        return $http.put('/api/members/'+user._id,changes)
        .then(function(res){
            return res.data;
        });
    };

    var getOrders = function(user){
        return $http.get('/api/orders/members/'+user._id+'/history')
        .then(function(res){
            return res.data;
        });
    };

    var getCart = function(user){
        return $http.get('/api/orders/members/'+user._id+'/cart')
        .then(function(res){
            return res.data;
        });
    };

    var removeOrderItem = function(cart, item){

        return $http.put('/api/orders/cart/remove/'+cart._id+'/'+item._id)
        .then(function(res){
            return res.data;
        });
    };

    var updateOrderItem = function(cart, item){

        return $http.put('/api/orders/cart/update/'+cart._id+'/'+item._id, {quantity: item.quantity})
        .then(function(res){
            return res.data;
        });
    };

    var editOrder = function(cart, amount, customer, promo){
        var info = {
            name: customer.name,
            email: customer.email,
            total: amount,
            orders: cart,
            promoCode: promo?promo._id:null
        };

        return $http.put('/api/orders/members/checkout', info)
        .then(function(res){
            return res.data;
        });
    };

    return {
        editUser:editUser,
        getOrders:getOrders,
        getCart:getCart,
        removeOrderItem: removeOrderItem,
        updateOrderItem: updateOrderItem,
        editOrder: editOrder
    };
});