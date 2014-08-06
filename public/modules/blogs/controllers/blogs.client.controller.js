'use strict';

angular.module('blogs').controller('BlogsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Blogs', 'Comments', 'Likes',
	function($scope, $stateParams, $location, Authentication, Blogs, Comments, Likes) {
		$scope.authentication = Authentication;
		$scope.liked = false;

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
				$scope.blog = response;
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
		   var comm = new Comments({
		   	     blogId: $scope.blog._id,
		   	    _id: comment._id,
		   	    commOwner: comment.commOwner
		   });
           comm.$remove(function(response) { console.log(response);
           	  for (var i in $scope.blog.comments) {
				if ($scope.blog.comments[i] === comment) {
					$scope.blog.comments.splice(i, 1);
					console.log($scope.blog.comments);
				}
		      }
			}, function(errorResponse) {
				$scope.commError = errorResponse.data.commMessage;
				alert($scope.commError);
			});
		};

		$scope.checkLikes = function(likes) {
		  
			for (var i in likes) {
				if (likes[i].user === $scope.authentication.user._id) {
					$scope.liked = true;
					return true;
				}
			} 
            return false;
          
		};

		$scope.likePost = function() {
            var like = new Likes ({
                blogId: $scope.blog._id,
                dest: "like"
            });

            like.$save(function(response) {
            	console.log(response);

				$scope.blog = response;
				$scope.liked = true;
			}, function(errorResponse) {
				$scope.likeError = errorResponse.data.message;
				alert($scope.likeError);
			});
		};

		$scope.unlikePost = function() {
            var unlike = new Likes ({
                blogId: $scope.blog._id,
                dest: "unlike"
            });

            unlike.$destroy(function(response) {
            	console.log(response);
				$scope.blog = response;
				$scope.liked = false;
			}, function(errorResponse) {
				$scope.likeError = errorResponse.data.message;
				alert($scope.likeError);
			});
		};
	}
]);



angular.module('blogs').directive('checkLength', function() {
    var usernameRegexp = /^[^.$\[\]#\/\s]+$/;

    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function(viewValue) {
                 if (viewValue.length === 0) {
                        ctrl.$setValidity('invalid', false);
     
                        return undefined;
                 } else {
                       ctrl.$setValidity('invalid', true);
                       return viewValue;
                 }
               });
        }
    };
});