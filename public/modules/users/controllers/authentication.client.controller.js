'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');
		$scope.EMAIL_REGEXP = 	/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
		$scope.url_regex = /^(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})?$/;

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				//If successful we assign the response to the global user model
				$scope.authentication.user = response;

				//And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				//If successful we assign the response to the global user model
				$scope.authentication.user = response;

				//And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

        //Allow users the ability to remove error messages from the screen
		$scope.removeError = function() {
			$scope.error = null;
		};
	}
]);