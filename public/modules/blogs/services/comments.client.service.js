'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('blogs').factory('Comments', ['$resource',
	function($resource) {
		return $resource('blogs/:blogId/comments/:commId', { blogId: '@blogId', commId: '@_id'	} );
	}
]);