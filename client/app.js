var app = angular.module('app', ['ngRoute']);
console.log("app loaded")
      var apikey = "AIzaSyCruLojKum0HoBDOYll_gW8D2NPSLVvHZU"
      var playerReady = false;



app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/partials/login.html',
      controller: 'loginController'
    })
    .when('/register', {
      templateUrl: '/partials/register.html',
      controller: 'registerController'
    })
    .when('/dashboard', {
      templateUrl: '/partials/dashboard.html',
      controller: 'dashboardController'
    })
    .when('/room', {
      templateUrl: '/partials/room.html',
      controller: 'roomController'
    })
    .otherwise({
      redirectTo: '/'
    });
});