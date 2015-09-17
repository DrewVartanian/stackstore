'use strict';

app.directive('productItem', function() {
    return {
        restrict: 'E',
        templateUrl: 'js/products/item/product.item.html',
        scope: {
            product: '=info'
        },
        link: function(scope, elem, attrs) {

        }
    }
});