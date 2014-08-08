'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Blogs',
    function($scope, Authentication, Blogs) {
        // This provides Authentication context.
        $scope.authentication = Authentication;

        //get all the blogs in the database
        $scope.find = function() {
            $scope.blogs = Blogs.query();
        };
    }
]);