app.config(function ($stateProvider) {

    $stateProvider.state('membersOnly.edit', {
        url: '/edit',
        templateUrl:  'js/members-only/edit/edit.html',
        controller: 'MemberEditController',
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }
    });

});

app.controller('MemberEditController',function ($scope,MemberFactory,$state,AuthService) {
    $scope.email=$scope.$parent.user.email;
    $scope.password = '';
    $scope.editUser = function(){
        var userInfo = {
            email: $scope.email
        };
        if ($scope.password) {
            userInfo.password = $scope.password;
        }
        MemberFactory.editUser($scope.$parent.user,userInfo)
        .then(function(){
            return AuthService.getLoggedInUser(true);
        }).then(function(user){
            $scope.$parent.user=user;
            $state.go('membersOnly.view');
        });
    };
});