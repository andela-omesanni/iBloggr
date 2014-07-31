'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Blogs',
	function($scope, Authentication, blogs) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.find = function() {
			$scope.blogs = Blogs.query();
		};
	}
]);