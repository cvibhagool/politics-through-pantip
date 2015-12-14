app.controller('MultiCtrl', ['$scope', '$window', '$http', 'postService', function($scope, $window, $http, postService){
  angular.element($window).on('resize', function(){$scope.$apply(); });

  //For initializing keywords for the particular controller instnace
  $scope.init = function(keywords){
    $scope.keywords = keywords;
    $scope.searchBox = keywords;
    $scope.submitted = false;
    postService.getPosts($scope.keywords,function(data){
      $scope.data = data;
    });
  };

  $scope.submit = function(){
    if ($scope.searchBox){
      $scope.submitted = true;
      $scope.keywords = $scope.searchBox;
      postService.getPosts($scope.keywords,function(data){
        $scope.data = data;
        $scope.submitted = false;
      });
    }
  };
  
}]);