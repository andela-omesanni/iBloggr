'use strict';

angular.module('blogs').controller('BlogsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Blogs', 'Comments',
	function($scope, $stateParams, $location, Authentication, Blogs, Comments) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var blog = new Blogs({
				title: this.title,
				content: this.content
			});
			blog.$save(function(response) {
				$location.path('blogs/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			this.title = '';
			this.content = '';
		};

        $scope.createComment = function() {

			var comment = new Comments({
				blogId: $scope.blog._id,
				commbody: $scope.commbody
			});
			$scope.blog.comments.push(comment);
			comment.$save(function(response) {
				$location.path('blogs/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
			$scope.commbody = '';
	   };

		$scope.remove = function(blog) {
			if (blog) {
				blog.$remove();

				for (var i in $scope.blogs) {
					if ($scope.blogs[i] === blog) {
						$scope.blogs.splice(i, 1);
					}
				}
			} else {
				$scope.blog.$remove(function() {
					$location.path('/');
				});
			}
		};

		$scope.update = function() {
			var blog = $scope.blog;

			blog.$update(function() {
				$location.path('blogs/' + blog._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.blogs = Blogs.query();
		};

		$scope.findOne = function() {
			$scope.blog = Blogs.get({
				blogId: $stateParams.blogId
			});
		};

		$scope.deleteComment = function(comment) {
           comment.remove();

           for (var i in $scope.comments) {
				if ($scope.comments[i] === comment) {
					$scope.comments.splice(i, 1);
				}
		    }
		};
	}
]);