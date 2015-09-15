'use strict';

app.factory('Product', function ($http) {

	var fetchAll = function () {
		return $http.get('/api/products/')
		.then(function (res) {
			return res.data;
		});
	};

	return {
		fetchAll: fetchAll
	};
});