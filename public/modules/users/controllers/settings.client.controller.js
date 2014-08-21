'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
        
        $scope.removeAlert = function(message) {
              if (message === "error") {
                  $scope.error = null;
              } else {
              	  $scope.success = null;
              }
        };

		$scope.findUser = function() {
			$http.get('/users/me').success(function(response) {
                  $scope.owner = response;
		    });
		};

		// Update a user profile
		$scope.updateUserProfile = function() {
			$scope.success = $scope.error = null;
			var user = new Users($scope.owner);

			user.$update(function(response) {
				$scope.success = true;
				Authentication.user = response;
			}, function(response) {
				$scope.error = response.data.message;
			});
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;
			$scope.userForm.$setPristine();

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

angular.module('users').directive('ngConfirmField', function () {
  return {
    require: 'ngModel',
    scope: {
      confirmAgainst: '=',
    },
    link: function (scope, iElement, iAttrs, ngModelCtrl) {

      var updateValidity = function () {
        var viewValue = ngModelCtrl.$viewValue;
        var isValid = isFieldValid();
        if(ngModelCtrl.$viewValue)
        ngModelCtrl.$setValidity('noMatch', isValid);
        // If the field is not valid, return undefined.
        return isValid ? viewValue : undefined;
      };

      // Test the confirm field view value matches the confirm against value.
      var isFieldValid = function () {
        return ngModelCtrl.$viewValue === scope.confirmAgainst;
      };

      // Convert data from view format to model format
      ngModelCtrl.$parsers.push(updateValidity);

      // Watch for changes in the confirmAgainst model.
      scope.$watch('confirmAgainst', updateValidity);
    }
  };
});
