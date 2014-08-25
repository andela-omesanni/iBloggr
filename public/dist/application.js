'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'ibloggr';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ui.router',
        'ui.bootstrap',
        'ui.utils'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName) {
      // Create angular module
      angular.module(moduleName, []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('blogs');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');'use strict';
// Configuring the Articles module
angular.module('blogs').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Blogs', 'blogs', 'dropdown', '/blogs(/create)?');
    Menus.addSubMenuItem('topbar', 'blogs', 'New Blog', 'blogs/create');
  }
]);'use strict';
// Setting up route
angular.module('blogs').config([
  '$stateProvider',
  function ($stateProvider) {
    // Blogs state routing
    $stateProvider.state('createBlog', {
      url: '/blogs/create',
      templateUrl: 'modules/blogs/views/create-blog.client.view.html'
    }).state('viewBlog', {
      url: '/blogs/:blogId',
      templateUrl: 'modules/blogs/views/view-blog.client.view.html'
    }).state('editBlog', {
      url: '/blogs/:blogId/edit',
      templateUrl: 'modules/blogs/views/edit-blog.client.view.html'
    }).state('otherwise', { url: '#!/' });
  }
]);'use strict';
angular.module('blogs').controller('BlogsController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Blogs',
  'Comments',
  'Likes',
  function ($scope, $stateParams, $location, Authentication, Blogs, Comments, Likes) {
    $scope.authentication = Authentication;
    $scope.liked = false;
    //creates a new blog
    $scope.create = function () {
      var blog = new Blogs({
          title: this.title,
          content: this.content
        });
      blog.$save(function (response) {
        $location.path('blogs/' + response._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      this.title = '';
      this.content = '';
    };
    //creates a new comment
    $scope.createComment = function () {
      var comment = new Comments({
          blogId: $scope.blog._id,
          commbody: $scope.commbody
        });
      comment.$save(function (response) {
        $scope.blog = response;
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      $scope.commbody = '';
    };
    //delete a blog
    $scope.remove = function (blog) {
      if (blog) {
        blog.$remove();
        for (var i in $scope.blogs) {
          if ($scope.blogs[i] === blog) {
            $scope.blogs.splice(i, 1);
          }
        }
      } else {
        $scope.blog.$remove(function () {
          $location.path('/');
        });
      }
    };
    $scope.checkBlog = function () {
      console.log('in here');
      if (typeof $scope.blog.length === 'undefined') {
        console.log('true');
        return true;
      }
      console.log($scope.blog.length);
    };
    //update a blog
    $scope.update = function () {
      var blog = $scope.blog;
      blog.$update(function () {
        $location.path('blogs/' + blog._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    //retrieve only one blog
    $scope.findOne = function () {
      if ($stateParams.blogId !== '') {
        Blogs.get({ blogId: $stateParams.blogId }, function success(response) {
          $scope.blog = response;
        }, function (errorResponse) {
          $scope.errorMess = errorResponse;
        });
      } else {
        $scope.errorMess = 'Oops!! Blog doesn\'t exist';
      }
    };
    //delete a comment
    $scope.deleteComment = function (comment) {
      var comm = new Comments({
          blogId: $scope.blog._id,
          _id: comment._id,
          commOwner: comment.commOwner
        });
      comm.$remove(function (response) {
        $scope.blog = response;
      });
    };
    //checks if user has already liked a blog
    $scope.checkLikes = function (likes) {
      for (var i in likes) {
        if (likes[i].user === $scope.authentication.user._id) {
          $scope.liked = true;
          return true;
        }
      }
      return false;
    };
    //remove error message associated with liking a blog
    $scope.removeError = function () {
      $scope.likeError = null;
    };
    //like a blog
    $scope.likeBlog = function () {
      var like = new Likes({
          blogId: $scope.blog._id,
          dest: 'like'
        });
      like.$save(function (response) {
        $scope.blog = response;
        $scope.liked = true;
      }, function (errorResponse) {
        $scope.likeError = errorResponse.data.message;
      });
    };
    //unlike a blog
    $scope.unlikeBlog = function () {
      var unlike = new Likes({
          blogId: $scope.blog._id,
          dest: 'unlike'
        });
      unlike.$destroy(function (response) {
        $scope.blog = response;
        $scope.liked = false;
      }, function (errorResponse) {
        $scope.likeError = errorResponse.data.message;
        ;
      });
    };
  }
]);'use strict';
//Articles service used for communicating with the articles REST endpoints
angular.module('blogs').factory('Blogs', [
  '$resource',
  function ($resource) {
    return $resource('blogs/:blogId', { blogId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
//Articles service used for communicating with the articles REST endpoints
angular.module('blogs').factory('Comments', [
  '$resource',
  function ($resource) {
    return $resource('blogs/:blogId/comments/:commId', {
      blogId: '@blogId',
      commId: '@_id'
    });
  }
]);'use strict';
//Articles service used for communicating with the articles REST endpoints
angular.module('blogs').factory('Likes', [
  '$resource',
  function ($resource) {
    return $resource('blogs/:blogId/:dest', {}, {
      save: {
        method: 'POST',
        params: {
          dest: 'like',
          blogId: '@blogId'
        }
      },
      destroy: {
        method: 'DELETE',
        params: {
          dest: 'unlike',
          blogId: '@blogId'
        }
      }
    });
  }
]);'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');
    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    });
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  'Authentication',
  'Menus',
  function ($scope, Authentication, Menus) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);'use strict';
angular.module('core').controller('HomeController', [
  '$scope',
  'Authentication',
  'Blogs',
  function ($scope, Authentication, Blogs) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    //get all the blogs in the database
    $scope.find = function () {
      $scope.blogs = Blogs.query();
    };
  }
]);'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [function () {
    // Define a set of default roles
    this.defaultRoles = ['user'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision 
    var shouldRender = function (user) {
      if (user) {
        for (var userRoleIndex in user.roles) {
          for (var roleIndex in this.roles) {
            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          //alert("yea");
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic || this.menus[menuId].isPublic,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic || this.menus[menuId].isPublic,
            roles: roles || this.defaultRoles,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar');
  }]);'use strict';
// Config HTTP Error Handling
angular.module('users').config([
  '$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push([
      '$q',
      '$location',
      'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              // Redirect to signin page
              //$location.path('signin');
              break;
            case 403:
              // Add unauthorized behaviour 
              break;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);'use strict';
// Setting up route
angular.module('users').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('profile', {
      url: '/settings/profile',
      templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
    }).state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).state('accounts', {
      url: '/settings/accounts',
      templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
    }).state('signup', {
      url: '/signup',
      templateUrl: 'modules/users/views/signup.client.view.html'
    }).state('signin', {
      url: '/signin',
      templateUrl: 'modules/users/views/signin.client.view.html'
    });
  }
]);'use strict';
angular.module('users').controller('AuthenticationController', [
  '$scope',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    //If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    $scope.EMAIL_REGEXP = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
    $scope.url_regex = /^(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})?$/;
    $scope.choiceOne = [
      { id: 'choice1' },
      { id: 'choice2' }
    ];
    $scope.choiceTwo = [
      { id: 'choice1' },
      { id: 'choice2' }
    ];
    $scope.optionOne = [];
    $scope.optionTwo = [];
    $scope.questions = [];
    $scope.selected = '';
    $scope.setShow = function (val) {
      $scope.selected = val;
    };
    $scope.isSelected = function (val) {
      return val === $scope.selected;
    };
    $scope.addNewChoice = function (num) {
      var newItemNo;
      if (num === 1) {
        newItemNo = $scope.choiceOne.length + 1;
        $scope.choiceOne.push({ id: 'choice' + newItemNo });
      } else {
        newItemNo = $scope.choiceTwo.length + 1;
        $scope.choiceTwo.push({ id: 'choice' + newItemNo });
      }
    };
    $scope.deleteChoice = function (index, num) {
      if (num === 1) {
        if ($scope.choiceOne.length === 2) {
          alert('sorry u can\'t touch this');
        } else {
          $scope.choiceOne.splice(index, 1);
          $scope.optionOne.splice(index, 1);
          changeIds($scope.choiceOne);
        }
      } else {
        if ($scope.choiceTwo.length === 2) {
          alert('sorry u can\'t touch this');
        } else {
          $scope.choiceTwo.splice(index, 1);
          $scope.optionTwo.splice(index, 1);
          changeIds($scope.choiceTwo);
        }
      }
    };
    var changeIds = function (array) {
      for (var i in array) {
        array[i].id = 'choice' + i;
      }
    };
    $scope.showAddChoice = function (choice, num) {
      if (num === 1)
        return choice.id === $scope.choiceOne[$scope.choiceOne.length - 1].id;
      else
        return choice.id === $scope.choiceTwo[$scope.choiceTwo.length - 1].id;
    };
    $scope.signup = function () {
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        //If successful we assign the response to the global user model
        $scope.authentication.user = response;
        //And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        //If successful we assign the response to the global user model
        $scope.authentication.user = response;
        //And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    //Allow users the ability to remove error messages from the screen
    $scope.removeError = function () {
      $scope.error = null;
    };
  }
]);'use strict';
angular.module('users').controller('SettingsController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    $scope.EMAIL_REGEXP = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
    $scope.url_regex = /^(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})?$/;
    // Check if there are additional accounts 
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }
      return false;
    };
    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider];
    };
    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;
      $http.delete('/users/accounts', { params: { provider: provider } }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.removeAlert = function (message) {
      if (message === 'error') {
        $scope.error = null;
      } else {
        $scope.success = null;
      }
    };
    $scope.findUser = function () {
      $http.get('/users/me').success(function (response) {
        $scope.owner = response;
      });
    };
    // Update a user profile
    $scope.updateUserProfile = function () {
      $scope.success = $scope.error = null;
      var user = new Users($scope.owner);
      user.$update(function (response) {
        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };
    // Change user password
    $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null;
      $scope.userForm.$setPristine();
      $http.post('/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);
angular.module('users').directive('ngConfirmField', function () {
  return {
    require: 'ngModel',
    scope: { confirmAgainst: '=' },
    link: function (scope, iElement, iAttrs, ngModelCtrl) {
      var updateValidity = function () {
        var viewValue = ngModelCtrl.$viewValue;
        var isValid = isFieldValid();
        if (ngModelCtrl.$viewValue)
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
});'use strict';
// Authentication service for user variables
angular.module('users').factory('Authentication', [function () {
    var _this = this;
    _this._data = { user: window.user };
    return _this._data;
  }]);'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users', {}, { update: { method: 'PUT' } });
  }
]);