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
    $scope.editUser = function(){
        MemberFactory.editUser($scope.$parent.user,{email:$scope.email})
        .then(function(){
            return AuthService.getLoggedInUser(true);
        }).then(function(user){
            $scope.$parent.user=user;
            $state.go('membersOnly.view');
        });
    };
});