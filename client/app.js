var app = angular.module('app', ['ngRoute']);
console.log("app loaded")
      var apikey = "AIzaSyCruLojKum0HoBDOYll_gW8D2NPSLVvHZU"
      var playerReady = false;



app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      // templateUrl: '/partials/login.html',
      // controller: 'loginController'
      templateUrl: '/partials/dashboard.html',
      controller: 'dashboardController'
    })
    .when('/register', {
      templateUrl: '/partials/register.html',
      controller: 'registerController'
    })
    .when('/login', {
      // templateUrl: '/partials/dashboard.html',
      // controller: 'dashboardController'
      templateUrl: '/partials/login.html',
      controller: 'loginController'
    })
    .when('/profile', {
      templateUrl: '/partials/profile.html',
      controller: 'profileController'
    })
    .when('/room/:room_id', {
      templateUrl: '/partials/room.html',
      controller: 'roomController'
    })    
    .when('/browse', {
      templateUrl: '/partials/browse.html',
      controller: 'browseController'
    })
    .when('/create', {
      templateUrl: '/partials/create.html',
      controller: 'createController'
    })
    .otherwise({
      redirectTo: '/'
    });
});