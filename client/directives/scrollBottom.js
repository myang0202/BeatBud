console.log("directive loaded")
app.directive('ngScrollBottom', ['$timeout', function ($timeout) {
  return {
    scope: {
      ngScrollBottom: "="
    },
    link: function ($scope, $element, $attr, $ctrl) {
      $scope.$watchCollection('ngScrollBottom', function (newValue) {
        console.log("IN DIRECTIVE")
        if (newValue) {
          $timeout(function(){
            if($scope.$parent.scrolledToBottom){
              $element[0].scrollTop = $element[0].scrollHeight;
            }
          }, 0);
        }
      });
    }
  }
}]);