app.factory('userFactory', ['$http', function($http) {
	function UserConstructor() {
		var self = this
		this.loggedIn = false
		this.users = []
		this.login = function(user, cb){
			if (typeof(cb) === 'function') {  
				$http.post('/login', user).then(function(data){
					console.log(data)
              		if(data.data.hasOwnProperty("email")){
		                self.loggedUser = data.data
		                self.loggedIn = true
		                console.log(self.loggedUser)
		            }
		            cb(data.data)
		        })
			}
		}
		this.register = function(user, cb){
			if (typeof(cb) === 'function') {  
				$http.post('/register', user).then(function(data){
              		if(data.data.hasOwnProperty("email")){
		                self.loggedUser = data.data
		                self.loggedIn = true
		                console.log(self.loggedUser)
		            }
		            cb(data.data)
		        })
			}
		}
		this.getLoggedUser = function(cb){
			$http.get('/loggedinuser').then(function(data){
          		if(data.data.hasOwnProperty("email")){
	                self.loggedUser = data.data
	            } else {
	            	self.loggedUser = {error: "not logged in"}
	            }
	            console.log(self.loggedUser)
	            cb(self.loggedUser)
			})
		}
		// this.getUser = function(id, cb){
		// 	$http.post('/user', {userid: id}).then(function(data){
		// 		console.log(data)
		// 		cb(data.data)
		// 	})
		// }
		this.logout = function(cb){
			if (typeof(cb) === 'function') {  
				$http.post('/logout').then(function(data){
					self.loggedIn = false
		            cb(data.data)
		        })
			}
		}
	}
		return (new UserConstructor());
}]);

