app.config(function ($stateProvider) {

    $stateProvider.state('admin.promos', {
        url: '/promos',
        templateUrl:  'js/admin/promos/promos.html',
        controller: 'AdminPromosController',
        // resolve:{
        //     promos: function(ProductFactory){
        //         return ProductFactory.fetchAll();
        //     }
        // },
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }
    });

});

app.controller('AdminPromosController',function ($scope) {
    console.log('promos state');
});
