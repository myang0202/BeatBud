app.factory('trackFactory', ['$http', function($http) {
	function TrackConstructor() {
		var self = this
		this.getRelatedVideos = function(videoId, cb){
			if (typeof(cb) === 'function') {  
				$http.get('https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&relatedToVideoId=' + videoId + '&key=AIzaSyCruLojKum0HoBDOYll_gW8D2NPSLVvHZU').then(function(data){
		            cb(data.data.items)
		        })
			}
		}
		// this.create = function(newsurvey, cb){
		// 	console.log(newsurvey)
		// 	if (typeof(cb) === 'function') {  
		// 		$http.post('/surveys', newsurvey).then(function(data){
		// 			cb(data.data)
		// 		})
		// 	}
		// }
		// this.getSurvey = function(id, cb){
		// 	if (typeof(cb) === 'function') {  
		// 		$http.post('/survey', {surveyid: id}).then(function(data){
		// 			cb(data.data)
		// 		})
		// 	}
		// }
		this.vote = function(body, cb){
			if (typeof(cb) === 'function') {  
				$http.post('/vote', body).then(function(data){
					cb(data.data)
				})
			}
		}
		// this.delete = function(id, cb){
		// 	if (typeof(cb) === 'function') {  
		// 		$http.post('/delete', {surveyid: id}).then(function(data){
		// 			cb(data.data)
		// 		})
		// 	}	
		// }
		
	}
		return (new TrackConstructor());
}]);

