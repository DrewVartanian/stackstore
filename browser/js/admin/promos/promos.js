app.config(function ($stateProvider) {

    $stateProvider.state('admin.promos', {
        url: '/promos',
        templateUrl:  'js/admin/promos/promos.html',
        controller: 'AdminPromosController',
        resolve:{
            promos: function(PromosFactory){
                return PromosFactory.fetchAll();
            }
        },
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }
    });

});

app.controller('AdminPromosController',function ($scope, promos) {
    
    var mappedPromos = promos.map(function(promo) {
        if(promo.type==='percent') {
            promo.description = 'Take '+promo.valueOff+'% off total price';
        }
        else promo.description = 'Take $'+promo.valueOff+' off total price';
        return promo;
    });

    $scope.promos = mappedPromos;
    console.log('description', $scope.promos.description);

   



});
