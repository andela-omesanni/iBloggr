'use strict';

// Setting up route
angular.module('blogs').config(['$stateProvider',
	function($stateProvider) {
		// Blogs state routing
		$stateProvider.
		state('listBlogs', {
			url: '/blogs',
			templateUrl: 'modules/blogs/views/list-blog.client.view.html'
		}).
		state('createBlog', {
			url: '/blogs/create',
			templateUrl: 'modules/blogs/views/create-blog.client.view.html'
		}).
		state('viewBlog', {
			url: '/blogs/:blogId',
			templateUrl: 'modules/blogs/views/view-blog.client.view.html'
		}).
		state('editBlog', {
			url: '/blogs/:blogId/edit',
			templateUrl: 'modules/blogs/views/edit-blog.client.view.html'
		});
	}
]);