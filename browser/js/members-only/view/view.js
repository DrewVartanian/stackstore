app.config(function ($stateProvider) {

    $stateProvider.state('membersOnly.view', {
        url: '/',
        templateUrl:  'js/members-only/view/view.html',
        controller: 'MemberViewController',
        resolve: {
            orders: function(MemberFactory, AuthService) {
                // If time permits find a way to do this with one query
                return AuthService.getLoggedInUser().then(function (user){
                    return MemberFactory.getOrders(user);
                });
            },
        },
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }

    });

});

app.controller('MemberViewController',function ($scope, orders) {
    $scope.orders = orders;
    console.log('orders', orders);

    $scope.orders.forEach(function(order){
        order.total = 0;
        order.items.forEach(function(item){
            item.total = item.quantity*item.price;
            order.total += item.total;
        });
    });



    // AuthService.getLoggedInUser().then(function (user){
    //     $scope.user = user;
    // });
    // SecretStash.getStash().then(function (stash) {
    //     $scope.stash = stash;
    // });
});