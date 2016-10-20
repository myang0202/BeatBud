app.factory('roomFactory', ['$http', function($http) {
	function RoomConstructor() {
		var self = this
		this.getAllRooms = function(cb){
			if (typeof(cb) === 'function') {  
				$http.get('/rooms').then(function(data){
		            cb(data.data)
		        })
			}
		}
		this.create = function(room, cb){
			if (typeof(cb) === 'function') {  
				$http.post('/rooms', room).then(function(data){
		            cb(data.data)
		        })
			}
		}

	}
		return (new RoomConstructor());
}]);

