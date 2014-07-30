'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Blogs'
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.find = function() {
			$scope.blogs = Blogs.query();
		};
	}
]);