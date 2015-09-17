app.config(function ($stateProvider) {

    $stateProvider.state('membersOnly', {
        url: '/members-area',
        templateUrl:  'js/members-only/members-only.html',
        controller: 'MemberController',
        resolve:{
            user: function(AuthService){
                return AuthService.getLoggedInUser();
            }
        },
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }
    });

});

app.controller('MemberController',function ($scope, SecretStash,AuthService,user) {
    $scope.user = user;
    // SecretStash.getStash().then(function (stash) {
    //     $scope.stash = stash;
    // });
});

app.factory('SecretStash', function ($http) {

    var getStash = function () {
        return $http.get('/api/members/secret-stash').then(function (response) {
            return response.data;
        });
    };

    return {
        getStash: getStash
    };

});

app.factory('MemberFactory',function ($http){
    var editUser = function(user,changes){
        return $http.put('/api/members/'+user._id,changes)
        .then(function(res){
            return res.data;
        });
    };

    var getOrders = function(user){
        return $http.get('/api/members/'+user._id+'/orders')
        .then(function(res){
            console.log("Within getOrders result of get request")
            return res.data;
        });
    };

    var getCart = function(user){
        return $http.get('/api/members/'+user._id+'/orders/cart')
        .then(function(res){
            return res.data;
        });
    };

    return {
        editUser:editUser,
        getOrders:getOrders,
        getCart:getCart
    };
});