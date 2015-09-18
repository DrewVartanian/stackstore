app.config(function ($stateProvider) {

    $stateProvider.state('admin.members', {
        url: '/members',
        templateUrl:  'js/admin/members/members.html',
        controller: 'AdminMembersController',
        resolve:{
            users: function(AdminMembersFactory){
                return AdminMembersFactory.getUsers();
            }
        },
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }
    });

});

app.controller('AdminMembersController',function ($scope,users,AdminMembers) {
    $scope.userSearch='';
    $scope.filteredUsers=users;
    $scope.searchUsers=function(){
        if(!$scope.userSearch){
            $scope.filteredUsers=users;
        }else{
            var re = new RegExp($scope.userSearch);
            $scope.filteredUsers=users.filter(function(user){
                return re.test(user.email);
            })
;        }
    };
    // SecretStash.getStash().then(function (stash) {
    //     $scope.stash = stash;
    // });
});

app.factory('AdminMembersFactory',function ($http){
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