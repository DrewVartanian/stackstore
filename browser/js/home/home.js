app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: function(CartFactory, $scope, FullstackPics){
            CartFactory.getCartItemNum();
            $scope.images = _.shuffle(FullstackPics);
        }
    });
});


// app.config(function ($stateProvider) {

//     // Register our *about* state.
//     $stateProvider.state('about', {
//         url: '/about',
//         controller: 'AboutController',
//         templateUrl: 'js/about/about.html'
//     });

// });

// app.controller('AboutController', function ($scope, FullstackPics) {

//     // Images of beautiful Fullstack people.
//     $scope.images = _.shuffle(FullstackPics);

// });