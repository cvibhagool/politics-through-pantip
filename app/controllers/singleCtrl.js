app.controller('SingleCtrl', ['$scope', '$window', '$http', 'postService', function($scope, $window, $http, postService){
  angular.element($window).on('resize', function(){$scope.$apply(); });

  //For initializing keywords for the particular controller instnace
  $scope.init = function(keywords){
    $scope.keywords = keywords;
    $scope.submitted = false;
    postService.getPosts($scope.keywords,function(data){
      $scope.data = data;
      if (data.series[0].spikes.length > 0){
        $scope.curSpike = data.series[0].spikes[0].date_time;
      } else {
        $scope.curSpike = undefined;
      }
    });
  };

  $scope.submit = function(){
    if ($scope.text){
      $scope.submitted = true;
      $scope.keywords = [$scope.text];
      postService.getPosts($scope.keywords,function(data){
        $scope.data = data;
        if (data.series[0].spikes.length > 0){
          $scope.curSpike = data.series[0].spikes[0].date_time;
        } else {
          $scope.curSpike = undefined;
        }
        $scope.submitted = false;
      });
    }
  };
  
}]);