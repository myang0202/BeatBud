app.controller('registerController', ['$scope','userFactory', '$location', function($scope, userFactory, $location) {
    console.log("register controller loaded")
    $scope.register = function(){
    	console.log("registering")
    	$scope.errors = {}
    	$scope.hasDupEmail = false
    	userFactory.register({first_name: $scope.first_name, last_name: $scope.last_name, email: $scope.email, password: $scope.password}, function(data){
    		console.log("userfactory response")
    		console.log(data)
    		if(data.hasOwnProperty("errors")){
    			$scope.errors = data.errors
    		} else if(data.hasOwnProperty('code')){
          		$scope.hasDupEmail = true

          	} else {
    			$location.url('/dashboard')
    		}
    		console.log($scope.errors)
      	})
    }
}]);