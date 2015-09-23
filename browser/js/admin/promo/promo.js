app.config(function($stateProvider) {

    $stateProvider.state('admin.promo', {
        url: '/promo/:promoId',
        templateUrl: 'js/admin/promo/promo.html',
        controller: 'AdminPromoController',
        resolve: {
            promo: function(PromosFactory, $stateParams) {
                if ($stateParams.promoId === 'new') return {};
                console.log('in promo factory');
                console.log($stateParams.promoId);
                return PromosFactory.fetchById($stateParams.promoId);
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
    $scope.formatDateForHtml = function(date) {
        var myDate = date.match(/^(.+)T/)[1];
        return new Date(myDate);

    };

    $scope.newPromo = ($stateParams.promoId === 'new');
    if (!$scope.newPromo) {
        $scope.htmlExpire = $scope.formatDateForHtml(promo.expirationDate);
    }
    $scope.deletePromo = function() {
        AdminPromoFactory.deletePromo($stateParams.promoId).then(function() {
            $state.go('admin.promos');
        });
    };
    $scope.editPromo = function() {
        $scope.promo.expirationDate = $scope.htmlExpire;
        if ($scope.newPromo) {
            AdminPromoFactory.createPromo($scope.promo).then(function() {
                $state.go('admin.promos');
            });
        } else {
            AdminPromoFactory.editPromo($scope.promo).then(function() {
                $state.go('admin.promos');
            });
        }
    };
});

app.factory('AdminPromoFactory', function($http) {
    var editPromo = function(promo) {
        return $http.put('/api/promos/' + promo._id, promo)
            .then(function(res) {
                return res.data;
            });
    };

    var createPromo = function(promo) {
        promo.creationDate = new Date();
        return $http.post('/api/promos', promo)
            .then(function(res) {
                return res.data;
            });
    };

    var deletePromo = function(promoId) {
        return $http.delete('/api/promos/' + promoId)
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