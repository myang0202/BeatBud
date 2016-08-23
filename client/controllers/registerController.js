app.controller('registerController', ['$scope','userFactory', '$location', function($scope, userFactory, $location) {
    console.log("register controller loaded")
    $scope.hasErrors = false;
    $scope.register = function(){
    	console.log("registering")
    	userFactory.register({first_name: $scope.first_name, last_name: $scope.last_name, email: $scope.email, password: $scope.password}, function(data){
    		console.log("userfactory response")
    		console.log(data)
    		if(data.hasOwnProperty("error")){
    			$scope.hasErrors = true
    			$scope.errors = data
    		} else {
    			$location.url('/dashboard')
    		}
      	})
    }
}]);