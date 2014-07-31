'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('blogs').factory('Comments', ['$resource',
	function($resource) {
		return $resource('comments/:commId', {
			commId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);