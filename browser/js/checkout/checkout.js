app.config(function ($stateProvider) {

    $stateProvider.state('checkout', {
        url: '/checkout',
        templateUrl:  'js/checkout/checkout.html'
        // controller: 'CartController',
        // resolve: {
        //     cart: function(MemberFactory, AuthService) {
        //         // If time permits find a way to do this with one query
        //         return AuthService.getLoggedInUser().then(function (user){
        //             return MemberFactory.getCart(user);
        //         });
        //     }
        // },
        // // The following data.authenticate is read by an event listener
        // // that controls access to this state. Refer to app.js.
        // data: {
        //     authenticate: true
        // }

    });

});