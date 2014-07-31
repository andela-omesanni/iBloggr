'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('blogs').factory('Blogs', ['$resource',
	function($resource) {
		return $resource('blogs/:blogId', {
			blogId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);