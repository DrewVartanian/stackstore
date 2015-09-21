app.directive('navbar', function($rootScope, AuthService, AUTH_EVENTS, $state, CartFactory) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function(scope) {

            scope.items = [{
                label: 'About',
                state: 'about'
            }, {
                label: 'Find a home',
                state: 'products'
            }, {
                label: 'Account',
                state: 'membersOnly.view',
                auth: true
            }, ];

            scope.user = null;


            var getCartItemNum = function() {
                CartFactory.getCart().then(function(cart) {
                    console.log('cart', cart);
                    scope.cartLength = 0;
                    if (cart.items) {
                        cart.items.forEach(function(item) {
                            console.log('qty', item.quantity);
                            scope.cartLength += item.quantity;
                        });
                    }
                    
                });
            };

            getCartItemNum();
            //add to cart event will trigger getCartItemNum()

            scope.isLoggedIn = function() {
                return AuthService.isAuthenticated();
            };

            scope.logout = function() {
                AuthService.logout().then(function() {
                    $state.go('home');
                });
            };

            var setUser = function() {
                AuthService.getLoggedInUser().then(function(user) {
                    scope.user = user;
                });
            };

            var removeUser = function() {
                scope.user = null;
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

        }

    };

});