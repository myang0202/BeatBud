app.controller('loginController', ['$scope','userFactory', 'socketFactory', '$location', function($scope, userFactory, socketFactory, $location) {
  console.log("signin controller loaded")
  $scope.login = function(){
    	console.log("logging in")
    	userFactory.login({email: $scope.email, password: $scope.password}, function(data){
    		console.log("userfactory response")
    		console.log(data)
        $scope.errors = {}
        if(data.hasOwnProperty("email")){
          $location.url('/browse')
        }else {
          $scope.errors = data
        }
      })
    }
  }]);