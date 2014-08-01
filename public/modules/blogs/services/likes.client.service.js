'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('blogs').factory('Likes', ['$resource',
	function($resource) {
		return $resource('blogs/:blogId/like', {}, {});
	}
]);