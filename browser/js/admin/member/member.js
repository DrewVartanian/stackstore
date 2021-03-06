app.config(function($stateProvider) {

    $stateProvider.state('admin.member', {
        url: '/member/:memberId',
        templateUrl: 'js/admin/member/member.html',
        controller: 'AdminMemberController',
        resolve: {
            user: function(AdminMemberFactory, $stateParams,MemberFactory) {
                var retUser;
                return AdminMemberFactory.getUser($stateParams.memberId).then(function(user){
                    retUser=user;
                    retUser._id=$stateParams.memberId;
                    return MemberFactory.getOrders(user);
                }).then(function(orders){
                    retUser.orders=orders;
                    return retUser;
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

app.controller('AdminMemberController', function($scope, user, MemberFactory, $stateParams, $state, AdminMemberFactory) {
    $scope.email = user.email;
    $scope.isAdmin = user.isAdmin;
    $scope.password = '';
    $scope.orders=user.orders;

    $scope.orders.forEach(function(order){
        order.total = 0;
        order.items.forEach(function(item){
            item.total = item.quantity*item.price;
            order.total += item.total;
        });
    });

    $scope.deleteUser = function() {
        AdminMemberFactory.deleteUser($stateParams.memberId).then(function() {
            $state.go('admin.members');
        });
    };

    $scope.editUser = function() {
        var userInfo = {
            email: $scope.email,
            isAdmin: $scope.isAdmin
        };
        if ($scope.password) {
            userInfo.password = $scope.password;
        }
        MemberFactory.editUser({
                _id: $stateParams.memberId
            }, userInfo)
            .then(function() {
                $state.go('admin.members');
            });
    };
});

app.factory('AdminMemberFactory', function($http) {
    var getUser = function(userId) {
        return $http.get('/api/members/' + userId)
            .then(function(res) {
                return res.data;
            });
    };

    var deleteUser = function(userId) {
        return $http.delete('/api/members/' + userId)
            .then(function(res) {
                return res.data;
            });
    };

    return {
        getUser: getUser,
        deleteUser: deleteUser
    };
});
