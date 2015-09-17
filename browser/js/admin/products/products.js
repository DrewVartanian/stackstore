app.config(function ($stateProvider) {

    $stateProvider.state('admin.products', {
        url: '/products',
        templateUrl:  'js/admin/products/products.html',
        controller: 'AdminProductsController',
        // resolve:{
        //     user: function(AuthService){
        //         return AuthService.getLoggedInUser();
        //     }
        // },
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }
    });

});

app.controller('AdminProductsController',function ($scope) {
    // SecretStash.getStash().then(function (stash) {
    //     $scope.stash = stash;
    // });
});