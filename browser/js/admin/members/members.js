app.config(function ($stateProvider) {

    $stateProvider.state('admin.members', {
        url: '/members',
        templateUrl:  'js/admin/members/members.html',
        controller: 'AdminMembersController',
        resolve:{
            users: function(AdminMembers){
                return AdminMembers.getUsers();
            }
        },
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }
    });

});

app.controller('AdminMembersController',function ($scope,users) {
    $scope.users=users;
    // SecretStash.getStash().then(function (stash) {
    //     $scope.stash = stash;
    // });
});

app.factory('AdminMembers',function ($http){
    var getUsers = function(user,changes){
        return $http.get('/api/members/')
        .then(function(res){
            return res.data;
        });
    };

    return {
        getUsers:getUsers
    };
});