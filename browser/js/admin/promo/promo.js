app.config(function($stateProvider) {

    $stateProvider.state('admin.promo', {
        url: '/promo/:promoId',
        templateUrl: 'js/admin/promo/promo.html',
        controller: 'AdminPromoController',
        resolve: {
            promo: function(PromosFactory, $stateParams) {
                if ($stateParams.promoId === 'new') return {};
                return PromosFactory.fetch($stateParams.promoId);
            }
        },
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }
    });

});

app.controller('AdminPromoController', function($scope, promo, AdminPromoFactory, $stateParams, $state) {
    $scope.promo = promo;
    $scope.newPromo = ($stateParams.promoId === 'new');
    $scope.deletePromo = function() {
        AdminPromoFactory.deletePromo($stateParams.promoId).then(function() {
            $state.go('admin.promos');
        });
    };
    $scope.editPromo = function() {
        if($scope.newPromo){
            AdminPromoFactory.createPromo($scope.promo).then(function() {
                $state.go('admin.promos');
            });
        }else{
            AdminPromoFactory.editPromo($scope.promo).then(function() {
                $state.go('admin.promos');
            });
        }
    };
});

app.factory('AdminPromoFactory', function($http) {
   var editPromo = function(promo) {
        return $http.put('/api/promo/' + promo._id, promo)
            .then(function(res) {
                return res.data;
            });
    };

    var createPromo = function(promo){
        return $http.post('/api/promo', promo)
            .then(function(res){
                return res.data;
            });
    };

    var deletePromo = function(promoId) {
        return $http.delete('/api/promo/' + promoId)
            .then(function() {
                return;
            });
    };

    return {
        editPromo: editPromo,
        createPromo: createPromo,
        deletePromo: deletePromo
    };
});

