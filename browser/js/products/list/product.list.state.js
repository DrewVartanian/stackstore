'use strict';

app.config(function ($stateProvider) {
    $stateProvider.state('products', {
        url: '/products',
        templateUrl: 'js/products/list/product.list.html',
        controllers: 'ProductListCtrl',
        resolve: {
        	products: function(Product){
        		return Product.fetchAll();
        	}
        }
    });
});