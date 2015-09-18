app.config(function($stateProvider) {

    $stateProvider.state('admin.member', {
        url: '/member/:memberId',
        templateUrl: 'js/admin/member/member.html',
        controller: 'AdminMemberController',
        resolve: {
            user: function(AdminMemberFactory,$stateParams) {
                return AdminMemberFactory.getUser($stateParams.memberId);
            }
        },
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }
    });

});

app.controller('AdminMemberController', function($scope, user) {
    
});

app.factory('AdminMemberFactory', function($http) {
    var getUser = function(userId) {
        return $http.get('/api/members/'+userId)
            .then(function(res) {
                console.log(res.data);
                return res.data;
            });
    };

    return {
        getUser: getUser
    };
});