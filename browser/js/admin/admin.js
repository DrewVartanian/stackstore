app.config(function ($stateProvider) {

    $stateProvider.state('admin', {
        url: '/admin',
        templateUrl:  'js/admin/admin.html',
        controller: 'AdminController',
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

app.controller('AdminController',function ($scope) {
    // SecretStash.getStash().then(function (stash) {
    //     $scope.stash = stash;
    // });
});