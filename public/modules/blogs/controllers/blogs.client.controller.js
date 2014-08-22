'use strict';

angular.module('blogs').controller('BlogsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Blogs', 'Comments', 'Likes',
    function($scope, $stateParams, $location, Authentication, Blogs, Comments, Likes) {
        $scope.authentication = Authentication;
        $scope.liked = false;
        
        //creates a new blog
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
        
        //creates a new comment
        $scope.createComment = function() {
            var comment = new Comments({
                blogId: $scope.blog._id,
                commbody: $scope.commbody
            });
            
            comment.$save(function(response) {
                $scope.blog = response;
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
            $scope.commbody = '';
        };

        //delete a blog
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

        //update a blog
        $scope.update = function() {
            var blog = $scope.blog;

            blog.$update(function() {
                $location.path('blogs/' + blog._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        //retrieve only one blog
        $scope.findOne = function() {
            $scope.blog = Blogs.get({
                blogId: $stateParams.blogId
            });
        };

        //delete a comment
        $scope.deleteComment = function(comment) { 
           var comm = new Comments({
                 blogId: $scope.blog._id,
                _id: comment._id,
                commOwner: comment.commOwner
           });

           comm.$remove(function(response) { 
             $scope.blog = response; 
           });
        };

        //checks if user has already liked a blog
        $scope.checkLikes = function(likes) {
           for (var i in likes) {
                if (likes[i].user === $scope.authentication.user._id) {
                    $scope.liked = true;
                    return true;
                }
            } 
            return false; 
        };
        
        //remove error message associated with liking a blog
        $scope.removeError = function() {
            $scope.likeError = null;
        };
        
        //like a blog
        $scope.likeBlog = function() {
            var like = new Likes ({
                blogId: $scope.blog._id,
                dest: "like"
            });

            like.$save(function(response) {
                $scope.blog = response;
                $scope.liked = true;
            }, function(errorResponse) {
                $scope.likeError = errorResponse.data.message;
            });
        };

        //unlike a blog
        $scope.unlikeBlog = function() {
            var unlike = new Likes ({
                blogId: $scope.blog._id,
                dest: "unlike"
            });

            unlike.$destroy(function(response) {
                $scope.blog = response;
                $scope.liked = false;
            }, function(errorResponse) {
                $scope.likeError = errorResponse.data.message;;
            });
        };
    }
]);
