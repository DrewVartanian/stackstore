app.config(function ($stateProvider) {

    $stateProvider.state('membersOnly.view', {
        url: '/',
        templateUrl:  'js/members-only/view/view.html',
        controller: 'MemberViewController',
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }
    });

});

app.controller('MemberViewController',function ($scope) {
    // AuthService.getLoggedInUser().then(function (user){
    //     $scope.user = user;
    // });
    // SecretStash.getStash().then(function (stash) {
    //     $scope.stash = stash;
    // });
});