app.config(function ($stateProvider) {

    $stateProvider.state('admin', {
        url: '/admin',
        templateUrl:  'js/admin/admin.html',
        controller: 'AdminController',
        resolve:{
            isAdmin: function(AuthService){
                return AuthService.getLoggedInUser().then(function(user){
                    return user.isAdmin;
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

app.controller('AdminController',function ($scope,$state,isAdmin) {
    if(!isAdmin){
        $state.go('login');
    }
    // SecretStash.getStash().then(function (stash) {
    //     $scope.stash = stash;
    // });
});